class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const search = this.queryStr.search ?
        {
            $or: [
                { name: { $regex: this.queryStr.search, $options: "i" } },
                { email: { $regex: this.queryStr.search, $options: "i" } }
            ]
        }
        : {};
        this.query = this.query.find({ ...search });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        const removeFields = [ "search" ];
        removeFields.forEach(key => delete queryCopy[key]);
        this.query = this.query.find().sort({ createdAt: queryCopy.sort === "Latest" ? -1 : 1 })
        return this;
    }
}


export default ApiFeatures;