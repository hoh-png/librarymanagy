import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BookList () {
    const navigate = useNavigate()
    const [bookState,setBookState] = useState([])

    const [changeState,setChangeState] = useState(false)
    const [createState,setCreateState] = useState(false)
    const [killState,setKillState] = useState(false)
    const [stockIDState,setStockIDState] =useState('')
    const [stockState,setStockState] = useState('')
    const [nameState,setNameState] = useState('')
    const [authorState,setAuthorState] = useState('')

    const [createTitleState,setCreateTitleState] = useState('')
    const [createAuthorState,setCreateAuthorState] = useState('')

    const [deleteState,setDeleteState] = useState('')

    function getBooks () {
        fetch('http://8.162.10.6:8080/books')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`请求失败：${response.status}`)
                }return response.json()
            })
            .then(data => setBookState(data.data))
            .catch(error => console.log(error.message))
    }
    function stockChange () {
        if (stockIDState) {
            const book = bookState.find(book => book.id === stockIDState)
            if (!book) {
                alert('未找到这本书！')
                return
            }
            const titleC = nameState ? nameState : book.title
            const authorC = authorState ? authorState : book.author
            const stockC = stockState ? Number(stockState) : book.stock
            fetch(`http://8.162.10.6:8080/admin/books/${book.id}`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: titleC,
                    author: authorC,
                    stock: stockC
                })
            })
             .then(response => {
                if (!response.ok) {
                    throw new Error(`请求失误${response.status}`)
                }return response.json()
             })
             .then(data => {
                alert(`书籍状态修改成功！` , data)
                getBooks()
            } 
            )
            .catch(error => {alert('书籍状态修改失败！');console.log(error.message)})
    }}
    function changeText () {
        if (changeState) {
            return (
                <div>
                    <input type="text" style={{height: '5vh',width: '15vw'}} placeholder='请输入你想更改的书的ID' onChange={e => setStockIDState(e.target.value)} value={stockIDState}/>
                    <input type="text" style={{height: '5vh',width: '15vw'}} placeholder='输入更改完毕后的数量' onChange={e => setStockState(e.target.value)} value={stockState}/>
                    <input type="text" style={{height: '5vh',width: '15vw'}} placeholder='请输入你想改成的名字'  onChange={e => setNameState(e.target.value)} value={nameState}/>
                    <input type="text" style={{height: '5vh',width: '15vw'}} placeholder='请输入更改后的作者' onChange={e => setAuthorState(e.target.value)} value={authorState}/>
                    <button style={{backgroundColor: '#000',color:'#fff'}} onClick={stockChange}>确认更改</button>
                    <button style={{backgroundColor: '#000',color:'#fff',marginLeft: '5px'}} onClick={() => {setKillState(false);setChangeState(false);setCreateState(false)}}>取消</button>
                </div>
            )}
    }
    function createChange () {
        if (createAuthorState && createTitleState) {
            fetch('http://8.162.10.6:8080/admin/books',{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: createTitleState,
                    author: createAuthorState
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`网络请求错误：${response.status}`)
                }return response.json()
            })
            .then(data => {alert('成功新增图书！',data);getBooks()})
            .catch(error => {alert('新增图书失败！想想你是不是管理员');console.log(error.message)})
        }
    }
    function createText () {
        if (createState) {
            return (
                <div>
                    <input type="text" style={{height: '5vh',width: '15vw'}} placeholder='请输入新加的书名' onChange={e => setCreateTitleState(e.target.value)} value={createTitleState}/>
                    <input type="text" style={{height: '5vh',width: '15vw'}} placeholder='请输入新加书的作者' onChange={e => setCreateAuthorState(e.target.value)} value={createAuthorState}/>
                    <button style={{backgroundColor: '#000',color:'#fff'}} onClick={createChange}>确认更改</button>
                    <button style={{backgroundColor: '#000',color:'#fff',marginLeft: '5px'}} onClick={() => {setKillState(false);setChangeState(false);setCreateState(false)}}>取消</button>
                </div>
            )}
    }
    function deleteChange () {
        if (deleteState) {
            const iidd = deleteState
            const bk = bookState.filter(book => book.id === iidd)
            if (bk.length ===0) {
                alert('未找到此书')
            }
            else if (bk.length != 0) {
                fetch(`http://8.162.10.6:8080/admin/books/${iidd}`,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`网络请求错误：${response.status}`)
                    }return response.json()
                })
                .then(data => {alert('成功删除',data);getBooks()})
                .catch(error => {alert('删除图书失败！');console.log(error.message)})
            }
        }
    }
    function killText () {
        if (killState) {
            return (
                <div>
                    <input type="text" style={{height: '5vh',width: '15vw'}} placeholder='请输入要删除的书籍ID' onChange={e => setDeleteState(e.target.value)} value={deleteState}/>
                    <button style={{backgroundColor: '#000',color:'#fff'}} onClick={deleteChange}>确认删除</button>
                    <button style={{backgroundColor: '#000',color:'#fff',marginLeft: '5px'}} onClick={() => {setKillState(false);setChangeState(false);setCreateState(false)}}>取消</button>
                </div>
            )}
    }
    useEffect(() => {getBooks()},[])
    return (
       <div>
            <button onClick={() => {setChangeState(true);setCreateState(false);setKillState(false)}}>更改书籍库存</button>
            <button onClick={() => {setChangeState(false);setCreateState(true);setKillState(false)}}>新加书籍</button>
            <button onClick={() => {setKillState(true);setChangeState(false);setCreateState(false)}}>移除书籍</button>
            <button onClick={() => navigate('/adminPage')} style={{ marginTop: 10,backgroundColor: '#111',color: '#fff'}}>
                返回管理员页面
            </button>
            {changeText()}
            {createText()}
            {killText()}
       </div>
    )
}

export default BookList