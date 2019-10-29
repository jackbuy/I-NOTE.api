export default class Model {
    readonly schema: any

    constructor(schema: any) {
        this.schema = schema;
    }

    /**
     * 查询多条数据
     * @param query 查询条件
     * @param select 返回字段
     * @param options 选项（排序、数量等）
     * @return promise
     */
    find({ query = {}, select = '-__v', options = {} }: any): Promise<object> {
        let find = this.schema.find(query, select);
        for (let i in options) find[i](options[i]);
        return find;
    }

    /**
     * 查询一条数据
     * @param query 查询条件
     * @param select 返回字段
     * @return promise
     */
    findOne({ query = {}, select = '-__v' }: any): Promise<object> {
        return this.schema.findOne(query, select)
    }

    /**
     * 保存
     * @param data 储存对象
     * @return promise
     */
    save({ data }: any): Promise<object> {
        if (!data) return Promise.reject('data is null');
        return new this.schema(data).save()
    }

    /**
     * 单个更新文档
     * @param query 查询条件
     * @param update 更新字段
     * @return promise
     */
    updateOne ({ query, update }: any): Promise<object> {
        if (!query) return Promise.reject('query is null');
        if (!update) return Promise.reject('update is null');
        return this.schema.updateOne(query, update);
    }

    /**
     * 移除文档
     * @param query 查询条件
     * @return promise
     */
    removeOne({ query }: any): Promise<object> {
        if (!query) return Promise.reject('query is null');
        return this.schema.deleteOne(query)
    }

    /**
     * 移除文档
     * @param query 查询条件
     * @return promise
     */
    remove({ query }: any): Promise<object> {
        if (!query) return Promise.reject('query is null');
        return this.schema.deleteMany(query)
    }

    /**
     * 计数文档
     * @param query 查询条件
     * @return promise
     */
    count({ query }: any): Promise<object> {
        return this.schema.find(query).countDocuments();
    }

    /**
     * 填充
     * @param param0 
     */
    populate ({ collections, options = {} }: any): Promise<object> {
        return this.schema.populate(collections, options);
    }

}