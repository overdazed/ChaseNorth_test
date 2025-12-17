// Helper function to check if product is new (added within last 14 days)
export const isProductNew = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = currentDate - createdDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 14;
};

// Helper function to check if it's daytime (between 6 AM and 6 PM)
export const isDaytime = () => {
    const hours = new Date().getHours();
    return hours >= 6 && hours < 18;
};
