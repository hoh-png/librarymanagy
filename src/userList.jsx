import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserList () {
    const navigate = useNavigate()
    const [usersState,setUsersState] = useState([])
    const [userErrorState,setUserErrorState] = useState((''))

    function grapUser () {
        fetch('http://8.162.10.6:8080/admin/users',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }) 
            .then(response => {
                if (!response.ok) {
                    throw new Error(`用户清单接口请求失败，状态码：${response.status}`)
                }return response.json();
            }
            )
            .then(data => {setUsersState(data.data);console.log(data.message)})
            .catch(error => {setUserErrorState(error.message);console.log(userErrorState)})
    }
    function users () {
        if (userErrorState) {
            return <div style={{ color: 'red' }}>{userErrorState}</div>;
        }

        if (usersState.length === 0) {
            return (
            <div>
                <p>您不是管理员</p>
            </div>
            )
        }
         function setAdminOrNot (ad,id) {
            fetch(`http://8.162.10.6:8080/admin/users/${id}/admin`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    "is_admin":!ad
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`请求失误：${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert(`用户管理员状态修改成功！` , data)
                grapUser()
            } 
            )
            .catch(error => {alert('用户管理员状态修改失败！');console.log(error.message)})
         }
        
        return (
            <div style={{padding:'15px',}}>
                {usersState.map(user => (
                    <div style={{borderTop: '#080a5d solid 1px'}} key={user.id}>
                        <h2>用户名：{user.username}</h2>
                        <h3>用户邮箱：{user.email}</h3>
                        <h3>用户id：{user.id}</h3>
                        <h3>用户是否为管理：{user.is_admin ? 'yes' : 'no' }</h3>
                        <button style={{backgroundColor: 'rgba(255, 119, 0, 1)',color: '#fff'}} onClick={() => setAdminOrNot(user.is_admin,user.id)}>更改其管理员状态</button>
                    </div>
                ))}
            </div>
        )
    }
    useEffect(() => {grapUser()},[])
    return (
        <div>
            {users()}
            <button onClick={() => navigate('/adminPage')} style={{ marginTop: 10,backgroundColor: '#111',color: '#fff' }}>
                返回管理员页面
            </button>
        </div>
    )
}

export default UserList