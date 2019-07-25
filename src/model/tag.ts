import { Tag } from '../schema';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

// 列表
export const tagQuery  = (req: any, res: any) => {
    Tag.find().then((resp: any) => {
        SuccessMsg( res, { data: resp} );
    });
}
