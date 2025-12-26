import { useEffect, useState } from 'react'
import './App.css'

function App() {  
  const [books,setBooks] = useState([])
  const [getAllErr,setGetAllErr] = useState('')
  const [pageChange,setPageChange] = useState(true)
  const [logged,setlogged] = useState(false)
  const [logEmailState,setLogEmailState] = useState('')
  const [logPassState,setLogPassState] = useState('')

  const [userEmailState,setUserEmailState] = useState('')
  const [userNameState,setUserNameState] = useState('')
  const [userPassState,setUserPassState] = useState('')
  
  const [logPage,setLogPage] = useState(false)
  const [signPageState,setSignPageState] =useState(false)

  const [myBooks,setMyBooks] = useState([])
  const [askPage,setAskPage] = useState(false)
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
        <div className='onebook' key={book.id}>
          <h3>{book.title}</h3>
          <p>作者：{book.author}</p>
          <p>库存：{book.stock}</p>
          <p>id：{book.id}</p>
          <button style={{backgroundColor: '#33a83dff',color: '#fff',margin: '0 1vw'}} onClick={() => borrow(book.id,book.stock)}>借</button>
          <button style={{backgroundColor: '#b12828ff',color: '#fff'}}  onClick={() => returnBook(book.id)}>还</button>
        </div>
      ))}
    </div>)
  }
  function borrow (bookId,bookstock) {
    if (!logged) {
      alert('请先登录后再借书')
      return
    }
    if (bookstock === 0) {
      alert('图书库里暂时没有库存')
      return
    }
    // 使用封装的 request 函数（自动带 token）
  request(`http://8.162.10.6:8080/books/borrow/${bookId}`, {
    method: 'POST'
  })
    .then(data => {
      console.log('借书数据:', data);
      alert('借书成功');
      getBookList();
      getCurrentMe();
    })
    .catch(error => {
      console.error('借书请求失败:', error);
      alert('借书失败');
    });
  }
  function returnBook (bookId) {
    if (!logged) {
      alert('请先登录')
      return
    }
    const hasBorrowed = myBooks.some(book => book.id === bookId);
    if (!hasBorrowed) {
      alert('你没有借阅过这本图书，无法归还！');
      return;
    }

    request(`http://8.162.10.6:8080/books/return/${bookId}`,{method:'POST'})
      .then(data => {
      console.log('还书数据:', data);
      alert('还书成功！');
      getBookList(); 
      getCurrentMe();
    })
      .catch(error => {
        console.error('还书请求失败:', error);
      alert(`还书失败：${error.message}`);
      })
  }
  function myBorrowedBooks () {
  if (myBooks.length === 0) return <p style={{borderTop: '1px solid #0a2550ff'}}>还没有借阅任何图书</p>;
  return (
    <div style={{padding: '5vh 0',textAlign: 'center'}}>
      {myBooks.map(book => (
        <div style={{borderTop: '1px solid #0a2550ff',lineHeight: '5vh'}}key={book.id}>
          <h2>《{book.title}》</h2>
          作者：{book.author}
        </div>
      ))}
    </div>
  );
}

  function tryLogIn () {
    setLogPage(true)
  }
  function closeLog () {
    setLogPage(false)
  }
  function logEmail (e) {
    setLogEmailState(e.target.value)
  }
  function logName (e) {
    setUserNameState(e.target.value)
  }
  function logPass (e) {
    setLogPassState(e.target.value)
  }
  function getCurrentMe () {
    request('http://8.162.10.6:8080/user/me')
    .then(data => {
      console.log('获取当前用户数据:', data);
      setUserNameState(data.data.username);
      setMyBooks(data.data.borrowed_books);
      // 同步更新 localStorage 的用户信息
      localStorage.setItem('userInfo', JSON.stringify(data.data));
    })
    .catch(error => console.log('获取当前用户失败：' + error))
  }
  function pushLog () {
    if (!logEmailState || !logPassState) {
      alert('请输入邮箱和密码');
      return;
    }
    setLogPage(false)
    request('http://8.162.10.6:8080/auth/login', { 
    method: 'POST',
    body: JSON.stringify({ "email": logEmailState, "password": logPassState })
  })
  .then(data => {
    console.log('登录成功:', data);
    alert('登录成功');
    
    // 核心：把存储逻辑移到 then 内部 + 加容错
    const { token, user } = data.data || {}; 
    if (token) localStorage.setItem('token', token); 
    if (user) localStorage.setItem('userInfo', JSON.stringify(user));
    
    setlogged(true);
    setUserNameState(user?.username || '');
    getCurrentMe();
  })
  .catch(error => {
    console.error('登录失败详情:', error);
    alert(`登录失败：${error.message}\n请检查邮箱/密码是否正确`);
    // 失败后清空无效存储
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setlogged(false);});
  }
  
  function toLog () {
    if (logPage) {
      return (     
          <div className= 'coverage'>
            <div className= 'logPage'>
              <h2>登陆页面</h2>
              <p>请输入你的邮箱</p><input className= 'logInForm' type="text" placeholder='邮箱' onChange={logEmail} value={logEmailState}/>
              <p>请输入你的密码</p><input className= 'logInForm' type="password" placeholder='密码' onChange={logPass} value={logPassState}/><br />
              <button style={{margin: '5px'}} onClick={pushLog}>登录</button>
              <span>还没注册？点击这里：</span><button onClick={trySign}>注册</button>
              <button style={{margin: '5px'}} onClick={closeLog}>关闭登录页面</button>
            </div>
          </div>
      )
    }
  }
  function backToLog () {
    setSignPageState(false)
    setLogPage(true)
  }
  function trySign () {
    setSignPageState(true)
    setLogPage(false)
  }
  function toSign () {
    if (signPageState) {
      return (
        <div className= 'coverage'>
          <div className= 'logPage'>
                <h2>注册页面</h2>
                <p>请输入你的邮箱</p><input className= 'logInForm' type="text" placeholder='邮箱' value={userEmailState} onChange={(e) => setUserEmailState(e.target.value)}/>
                <p>请输入你的用户名</p><input className= 'logInForm' type="text" placeholder='用户名' value={userNameState} onChange={(e) => setUserNameState(e.target.value)}/>
                <p>请输入你的密码</p><input className= 'logInForm' type="password" placeholder='密码' value={userPassState} onChange={(e) => setUserPassState(e.target.value)}/><br />
                <button style={{margin: '5px'}} onClick={signIn}>注册</button>
                <button style={{margin: '5px'}} onClick={backToLog}>返回登录页面</button>
              </div>
        </div>
    )}
  }
  function signIn () {
    if (!userEmailState) {
      alert('请输入注册邮箱')
      return;
    }
    if (!userNameState) {
      alert('请输入用户名')
      return;
    }
    if (!userPassState) {
      alert('请输入注册密码')
      return;
    }
    request('http://8.162.10.6:8080/auth/register', { 
    method: 'POST',
    body: JSON.stringify({
      "email": userEmailState,
      "username": userNameState,
      "password": userPassState
    })
  })
  .then(data => {
    console.log('注册成功:', data);
    alert('注册成功！即将为你跳转到登录页面');
    setUserEmailState('');
    setUserNameState('');
    setUserPassState('');
    setTimeout(() => {
      backToLog()
    }, 3000)
  })
  
  .catch(error => {
    console.error('注册请求失败:', error);
    alert(`注册失败：${error.message}\n可能是邮箱已被注册`);
  });
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
    return (
      <div >
        <div style={{margin: '20px',color: '#165407ff',fontSize: '30px',fontWeight: '900'}}>用户：{userNameState}</div>
        <div style={{margin: '20px',color: '#543507ff',fontSize: '30px',fontWeight: '900'}}>你的书库（记得及时归还）<button style={{backgroundColor: '#0550b9ff',color: '#fff',marginLeft: '30vw',fontSize: '20px',fontWeight: '500'}} onClick={toHome}>返回书籍页面</button></div>
        <div>
          {myBorrowedBooks()}
        </div>
      </div>
    )
  }
  function outPage () {
    setAskPage(true)
  }
  function askOut() {
    if (askPage) {
      return (
        <div className= 'coverage'>
          <div className="outPage">
            <div className='askIf'>
              <p>确认登出？</p>
              <button className='outBtt1' onClick={logOut}>确认</button>
              <button className='outBtt2' onClick={() => setAskPage(false)}>返回</button>
            </div>
          </div>
        </div>
      )
    }
  }

  function logOut () {
    request('http://8.162.10.6:8080/auth/logout', {
    method: 'POST' // 退出登录通常是 POST
  })
    .then(data => {
      console.log('已经登出：' + data);
      // 核心：清空 localStorage
      localStorage.clear(); // 或精准删除：localStorage.removeItem('token')
      // 清空前端状态
      setlogged(false);
      setUserNameState('');
      setMyBooks([]);
      setPageChange(true)
      setAskPage(false)
      alert('退出登录成功！');
    })
    .catch(error => console.log('出错：' + error))
  }

  // 封装通用请求函数，避免每个接口重复写 token 逻辑（核心：自动携带 token）
  function request(url, options = {}) {
    // 从 localStorage 取 token
    const token = localStorage.getItem('token');
    // 合并请求头：默认加 Content-Type + token
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      // 后端通常要求 token 放在 Authorization 头（格式：Bearer + 空格 + token）
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    return fetch(url, {
      credentials: 'include', // 保留，兼容cookie方案
      headers,
      ...options
    }).then(response => {
      // 统一处理 401（token 失效）
      if (response.status === 401) {
        alert('登录态已失效，请重新登录');
        localStorage.clear(); // 清空失效存储
        setlogged(false);
        setAskPage(false)
        setLogPage(true);
        throw new Error('token 失效');
      }
      if (!response.ok) throw new Error(`请求失败：${response.status}`);
      return response.json();
    });
  }
// 在组件最外层，useEffect 初始化时读取 localStorage
  useEffect(() => {
    getBookList(); // 原逻辑：获取图书列表
    
    // 新增：从 localStorage 恢复登录态
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    if (token && userInfo) {
      setlogged(true); // 恢复登录状态
      const user = JSON.parse(userInfo); // 转成对象
      setUserNameState(user.username); // 恢复用户名
      if (user.borrowed_books) setMyBooks(user.borrowed_books); // 恢复借阅列表
    }
  }, [])
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
          <button className='headSearchBtt'>搜索</button>
          <button className='logIn headbutton' onClick={tryLogIn} >注册/登录</button>
          <button className='home headbutton' onClick={toHome}>个人中心</button>
          <button className='logOut headbutton' onClick={outPage}>退出账号</button>
        </div>
        
        <div className='body'>
          <div className='bookList'>
            {pageChange ? content() : home()}
          </div>
        </div>
        {askOut()}
        {toLog()}
        {toSign()}
      </div>
      
    </>
  )
}

export default App
