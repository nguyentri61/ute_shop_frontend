import axios from "./axios.customize";

const AllCategories = async () => {
    const API = "/categories/all";
    return axios.get(API);
}

export { AllCategories }