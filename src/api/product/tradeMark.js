import request from '@/utils/request'

//商品品牌分页列表接口
export const reqBrandList = (page,limit) => {
    return request({
        url:`/admin/product/baseTrademark/${page}/${limit}`,
        method:'get'
    })
  };

//新增品牌接口/更新品牌接口（因为新增和更新品牌的区别，仅在于传参时是否带id参数）
export const reqAddOrUpdateBanner = (trademark)=>{
    if(trademark.id){
        return request({
            url:'/admin/product/baseTrademark/save',
            method:'put',
            data:trademark
        })
    }else{
        return request({
            url:'/admin/product/baseTrademark/save',
            method:'post',
            data:trademark
        })
    }
}