class APIFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){   //http:localhost:8000/api/v1/products?keyword=Dell
       let keyword =  this.queryStr.keyword ? {
            name: {     // it constructs a MongoDB query to search for documents where the name field matches the keyword
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
       }: {};

       this.query.find({...keyword})
       return this;
    }


    filter(){     //http://localhost:8000/api/v1/products?price[gt]=500 
                  //http://localhost:8000/api/v1/products?category=Headphones
                  const queryStrCopy = { ...this.queryStr };
  
                  //removing fields from query
                  const removeFields = ['keyword', 'limit', 'page'];
                  removeFields.forEach( field => delete queryStrCopy[field]);
                  
                  let queryStr = JSON.stringify(queryStrCopy);  //converts the modified queryStr object into a JSON string 
                  queryStr =  queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)
          
                  this.query.find(JSON.parse(queryStr));
          
                  return this;
              }


    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1; //number of values per page
        const skip = resPerPage * (currentPage - 1)   //for 3rd page it skips previous page values eg.2*3-1=4 it skips 4 values
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeatures;