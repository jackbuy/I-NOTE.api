import { Tag } from '../schema';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

// 列表
export const tagQuery  = (req: any, res: any) => {
    const query = {};
    Tag.find(query, '-__v')
    .then((resp: any) => {
        SuccessMsg( res, { data: resp} );
    });
}
