class CustomerFeatures {
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

    company() {
        const excludedCompanies = [
            "Fauji Fertilizer Company",
            "Pakistan State Oil (PSO)",
            "Engro Corporation",
            "Habib Bank Limited (HBL)",
            "Lucky Cement",
            "Pakistan Petroleum Limited (PPL)",
            "United Bank Limited (UBL)",
            "Nestlé Pakistan"
        ]
        const queryCopy = { ...this.queryStr };
        if (queryCopy.company === "Others") {
            this.query = this.query.find({ company: { $nin: excludedCompanies } })
        }else if (queryCopy.company) {
            this.query = this.query.find({ company: queryCopy.company });
        }
        return this;
    }
    industry() {
        const excludedIndustries = [
            "Textile",
            "Agriculture",
            "Cement",
            "Banking and Finance",
            "Oil and Gas",
            "Pharmaceuticals",
            "Automotive",
            "Fertilizer",
        ]
        const queryCopy = { ...this.queryStr };
        if (queryCopy.industry === "Others") {
            this.query = this.query.find({ industry: { $nin: excludedIndustries } });
        }else if (queryCopy.industry) {
            this.query = this.query.find({ industry: queryCopy.industry });
        }
        return this;
    }
}


export default CustomerFeatures;