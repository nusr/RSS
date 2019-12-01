// @ts-ignore
const requireAll = (requireContext) => {
  return requireContext.keys().map(requireContext)
}
// @ts-ignore
const req = require.context('./svg', false, /\.svg$/)
const data = requireAll(req)
// const result  = data.map(item=>{
//   const temp = item.default.id;
//   return temp.slice(5)
// })
// console.log(result.join('" | "'))
export default data
