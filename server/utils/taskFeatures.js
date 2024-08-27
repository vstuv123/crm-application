class TaskFeatures {
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
        const removeFields = [ "search" ];
        removeFields.forEach(key => delete queryCopy[key]);
        this.query = this.query.find().sort({ createdAt: queryCopy.sort === "Latest" ? -1 : 1 })
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


export default TaskFeatures;