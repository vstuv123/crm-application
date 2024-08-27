class LeadFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const search = this.queryStr.search ?
        {
            name: { $regex: this.queryStr.search, $options: "i" },
        }
        : {};
        this.query = this.query.find({ ...search });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        const removeFields = [ "search", "source" ];
        removeFields.forEach(key => delete queryCopy[key]);
        this.query = this.query.find().sort({ createdAt: queryCopy.sort === "Latest" ? -1 : 1 })
        return this;
    }

    source() {
        const queryCopy = { ...this.queryStr };
        const removeFields = [ "search", "sort" ];
        removeFields.forEach(key => delete queryCopy[key]);
        if (queryCopy.source) {
            this.query = this.query.find({ source: queryCopy.source });
        }
        return this;
    }
}


export default LeadFeatures;