import { useEffect, useState } from 'react'
import './App.css'

function App() {  
  const [books,setBooks] = useState([])
  const [getAllErr,setGetAllErr] = useState('')
  const [pageChange,setPageChange] = useState(true)
  const [logged,setlogged] = useState(false)
  const [userState,setUserState] = useState([])
  const [logPage,setLogPage] = useState(false)
  function getBookList () {
    fetch('http://8.162.10.6:8080/books')
      .then(response => {
        if (!response.ok) {
          throw new Error(`接口请求失败，状态码：${response.status}`)
        }
        return response.json()
      })
      .then(data => {setBooks(data.data)})
      .catch(error => {setGetAllErr(error.message)})
  }
  useEffect(() => {getBookList()},[])
  if (getAllErr) {
    return (<div>网络错误：{getAllErr}</div>)
  }
  function content () {
    if (books.length === 0) {
      return (<div className='noBook'>暂无图书数据</div>)
    }
    return (
    <div className='allBooks'>
      {books.map(book => (
        <div className='onebook'>
          <h3>{book.title}</h3>
          <p>作者：{book.author}</p>
          <p>库存：{book.stock}</p>
          <p>id：{book.id}</p>
          <button style={{backgroundColor: '#33a83dff',color: '#fff',margin: '0 1vw'}}>借</button>
          <button style={{backgroundColor: '#b12828ff',color: '#fff'}}>还</button>
        </div>
      ))}
    </div>)
  }
  function tryLogIn () {
    setLogPage(true)
  }
  function closeLog () {
    setLogPage(false)
  }
  function pushLog () {
    
  }
  function toLog () {
    if (logPage) {
      return (     
          <div className= 'coverage'>
            <div className= 'logPage'>
              <h2>登陆页面</h2>
              <p>请输入你的邮箱</p><input className= 'logInForm' type="text" placeholder='邮箱'/>
              <p>请输入你的用户名</p><input className= 'logInForm' type="text" placeholder='用户名'/>
              <p>请输入你的密码</p><input className= 'logInForm' type="text" placeholder='密码'/><br />
              <button style={{margin: '5px'}} onClick={pushLog}>登录</button>
              <button style={{margin: '5px'}} onClick={closeLog}>关闭登录页面</button>
            </div>
          </div>
      )
    }
  }
//  
  function toHome () {
    setPageChange(!pageChange)
  }
  function home() {
    if (!logged) {
      return (
        <div style={{color: 'red',fontWeight: '600',height: '5vh',lineHeight: '5vh'}}>您暂未登录！请登录：<button className='back headbutton' style={{backgroundColor: '#000000ff',color: '#ffffffff'}} onClick={tryLogIn}>注册/登录</button>
          <button className='back headbutton' style={{backgroundColor: '#0550b9ff',color: '#fff',}}onClick={toHome}>以游客身份继续看书</button>
        </div>
        
      )
    }
  }
// return (
//       <div>
        
//       </div>
//     )
  return (
    <>
      <div className='bigBack'>
        <div className='head'>
          <input type="text" className='searchText' placeholder='请输入搜索文本'/>
          <select name="" id="" className='options'>
            <option value="title">按书名</option>
            <option value="author">按作者</option>
            <option value="id">按ID</option>
          </select>
          <button className='logIn headbutton' onClick={tryLogIn} >注册/登录</button>
          <button className='home headbutton' onClick={toHome}>个人中心</button>
          <button className='logOut headbutton'>退出账号</button>
        </div>
        
        <div className='body'>
          <div className='bookList'>
            {pageChange ? content() : home()}
          </div>
        </div>
        {toLog()}
      </div>
      
    </>
  )
}

export default App
