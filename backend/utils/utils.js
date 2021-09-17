exports.getPagination = (pageIndex, pageSize) => {
    const limit = pageSize ? pageSize : 5;
    const offset = pageIndex ? pageIndex * limit : 0;

    return {limit, offset};
};