

class SaleFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        const removeFields = [ "search" ];
        removeFields.forEach(key => delete queryCopy[key]);
        this.query = this.query.find().sort({ createdAt: queryCopy.sort === "Latest" ? -1 : 1 })
        return this;
    }

    value() {
        const queryCopy = { ...this.queryStr };
        if (queryCopy.value) {
            let queryStr = JSON.stringify(queryCopy.value);
            queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
            this.query = this.query.find({value: JSON.parse(queryStr) });
        }
        return this;
    }
    closedDate() {
        const queryCopy = { ...this.queryStr };
        if (queryCopy.closedDate) {
            this.query = this.query.find({ closedDate: { $lte: queryCopy.closedDate } });
        }
        return this;
    }
}


export default SaleFeatures;