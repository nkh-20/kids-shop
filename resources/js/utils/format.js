export const formatPrice = (price) => {
    if (price == null) return '0 Ks';
    return `${Number(price).toLocaleString()} Ks`;
};

export const ucfirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};
