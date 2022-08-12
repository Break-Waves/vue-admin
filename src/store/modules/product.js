import {reqBrandList, reqAddOrUpdateBanner} from '@/api/product/tradeMark'
const state ={
    brandData:{}
}
const actions ={
    //请求品牌列表
    async getBrandList(context,{page,limit}){
      let result =   await reqBrandList(page,limit)
      if(result.code == 200){
        context.commit('GETBRANDLIST',result.data)
      }
    },
    async addOrUpdateBanner(context,value){
        let result = await reqAddOrUpdateBanner(value)
        if(result.code == 200){
            return console.log('添加品牌成功');
        }else{
            return console.log('添加品牌失败');
        }
    }
}
const mutations ={
    GETBRANDLIST(state,value){
        state.brandData = value
    }
}
const getters ={
    list:()=>state.brandData.records,
    total:()=>state.brandData.total,
    size:()=>state.brandData.size,
    current:()=>state.brandData.current
    
}

export default {
    namespaced:true,
    state,
    actions,
    mutations,
    getters
}