import BaseModel from './baseModel';
import { AdCate } from '../schema';

interface query {
    query: any;
    currentPage?: string;
    pageSize?: string;
    querySort?: any;
}

class AdCateModel extends BaseModel{


}

export default new AdCateModel(AdCate)
