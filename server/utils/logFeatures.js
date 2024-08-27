class LogFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        this.query = this.query.find().sort({ createdAt: queryCopy.sort === "Latest" ? -1 : 1 })
        return this;
    }

    date() {
        const queryCopy = { ...this.queryStr };
        if (queryCopy.date) {
            this.query = this.query.find({ date: { $lte: queryCopy.date } });
        }
        return this;
    }
}


export default LogFeatures;