import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

/** ---------- Search control (geosearch) ---------- */
function SearchField({ onSelect }) {
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({
            provider,
            style: "bar",
            autoComplete: true,
            autoCompleteDelay: 300,
            showMarker: false,
            keepResult: false,
            searchLabel: "Nhập địa chỉ...",
        });

        map.addControl(searchControl);

        // 🔒 Ngăn control tự submit form cha
        const root = document.querySelector(".leaflet-control-geosearch");
        const form = root?.querySelector("form");
        const submitBtn = form?.querySelector('button[type="submit"]');
        const input = form?.querySelector('input[type="text"], input');

        if (form) form.addEventListener("submit", (e) => e.preventDefault());
        if (submitBtn) submitBtn.setAttribute("type", "button");
        if (input) {
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") e.preventDefault();
            });
        }

        // Chọn kết quả tìm kiếm
        const onShowLocation = (e) => {
            const { x: lng, y: lat, label: address } = e.location;
            onSelect({ lat, lng, address });
        };
        map.on("geosearch/showlocation", onShowLocation);

        // Click trên bản đồ → reverse geocode
        const onMapClick = async (e) => {
            const { lat, lng } = e.latlng;
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                );
                const data = await res.json();
                onSelect({
                    lat,
                    lng,
                    address: data?.display_name || `${lat}, ${lng}`,
                });
            } catch {
                onSelect({ lat, lng, address: `${lat}, ${lng}` });
            }
        };
        map.on("click", onMapClick);

        return () => {
            map.removeControl(searchControl);
            map.off("geosearch/showlocation", onShowLocation);
            map.off("click", onMapClick);
            if (form) form.removeEventListener("submit", (e) => e.preventDefault());
            if (input) input.removeEventListener("keydown", () => { });
        };
    }, [map, onSelect]);

    return null;
}

/** ---------- Locate (current position) control ---------- */
function LocateControl({ onSelect }) {
    const map = useMap();

    useEffect(() => {
        // Tạo control container
        const Locate = L.Control.extend({
            onAdd() {
                const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
                const btn = L.DomUtil.create("button", "", container);
                btn.type = "button"; // 🔒 không submit form
                btn.title = "Xác định vị trí hiện tại";
                btn.style.width = "34px";
                btn.style.height = "34px";
                btn.style.display = "grid";
                btn.style.placeItems = "center";
                btn.style.fontSize = "16px";
                btn.style.cursor = "pointer";
                btn.innerText = "📍";

                // Chặn sự kiện để không kéo map khi giữ chuột
                L.DomEvent.disableClickPropagation(container);
                L.DomEvent.on(btn, "click", async () => {
                    // Loading state đơn giản trên nút
                    const oldText = btn.innerText;
                    btn.innerText = "…";

                    const finish = () => (btn.innerText = oldText);

                    if (!("geolocation" in navigator)) {
                        alert("Trình duyệt không hỗ trợ định vị.");
                        finish();
                        return;
                    }

                    navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                            const { latitude: lat, longitude: lng } = pos.coords;
                            map.flyTo([lat, lng], 17, { duration: 0.8 });

                            // Reverse geocode
                            try {
                                const res = await fetch(
                                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                                );
                                const data = await res.json();
                                onSelect({
                                    lat,
                                    lng,
                                    address: data?.display_name || `${lat}, ${lng}`,
                                });
                            } catch {
                                onSelect({ lat, lng, address: `${lat}, ${lng}` });
                            } finally {
                                finish();
                            }
                        },
                        (err) => {
                            // Các lỗi thường gặp: PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT
                            alert(
                                err?.message ||
                                "Không thể lấy vị trí hiện tại. Vui lòng bật quyền định vị."
                            );
                            finish();
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
                    );
                });

                return container;
            },
            onRemove() { },
        });

        const locate = new Locate({ position: "topright" });
        map.addControl(locate);

        return () => {
            map.removeControl(locate);
        };
    }, [map, onSelect]);

    return null;
}

/** ---------- AddressPicker ---------- */
export default function AddressPicker({ onAddressChange }) {
    const lat = parseFloat(import.meta.env.VITE_HCMUTE_LAT) || 10.850721;
    const lng = parseFloat(import.meta.env.VITE_HCMUTE_LNG) || 106.771395;

    const [position, setPosition] = useState([lat, lng]); // vị trí mặc định từ .env

    useEffect(() => {
        onAddressChange({
            lat,
            lng,
            address:
                "Trường Đại học Sư phạm Kỹ thuật TP.HCM, Thủ Đức, TP.HCM",
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelect = (data) => {
        setPosition([data.lat, data.lng]);
        onAddressChange(data);
    };

    return (
        <div className="space-y-2">
            <p className="text-sm text-gray-600">
                🔍 Nhập địa chỉ, click trên bản đồ, hoặc dùng nút 📍 để chọn vị trí hiện tại
            </p>
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: "300px", width: "100%", borderRadius: "12px" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />
                <SearchField onSelect={handleSelect} />
                <LocateControl onSelect={handleSelect} />
                <Marker position={position} />
            </MapContainer>
        </div>
    );
}
