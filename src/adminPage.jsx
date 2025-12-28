import { Link,Outlet,useNavigate, } from 'react-router-dom';


function AdminPage () {
    const navigate = useNavigate();

    return (
            <div>
                <Link to="/adminPage/userList"><button>用户名单</button></Link>
                <Link to="/adminPage/bookList"><button>图书库</button></Link>
                <button onClick={() => navigate('/')} style={{ margin: 10,backgroundColor: '#111',color: '#fff',boxSizing: 'border-box'}}>
                    返回个人中心
                </button>
            </div> 
            
    )
}

export default AdminPage