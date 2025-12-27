import { useNavigate } from 'react-router-dom';

function UpdatePage() {
  const navigate = useNavigate()

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #eee' }}>
      <h2>修改个人信息页面</h2>
      <p>这是单独文件中的 UpdatePage 组件</p>
        
      <button onClick={() => navigate('/')} style={{ marginTop: 10 }}>
        返回个人中心
      </button>
    </div>
  );
}

export default UpdatePage;