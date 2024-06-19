import React, { useEffect, useState } from "react";
import "./Post.css";
import axios from "axios";
import { ClipLoader } from "react-spinners";

interface Post {
  id: number;
  title: string;
  image: string;
  date: string;
  status: boolean;
}

export default function Post() {
  const [post, setPost] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);

  const showModalBlock = (id: number) => {
    setCurrentPostId(id);
    setShowModal(true);
  };

  const changeBlock = (id: number) => {
    axios.patch(`http://localhost:8080/posts/${id}`, { status: false }).then(() => {
      setPost((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, status: false } : post
        )
      );
    });
  };

  const confirmAction = () => {
    if (currentPostId !== null) {
      changeBlock(currentPostId);
      setShowModal(false);
      setCurrentPostId(null);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const getPost = () => {
    axios.get("http://localhost:8080/posts").then((res) => {
      setPost(res.data);
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <div>
        {loading ? (
          <ClipLoader
            color={"#454545"}
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <div>
            <div>
              Post
              <input type="text" placeholder="Nội dung tìm kiếm" />
              <select name="" id="">
                <option value="">Lọc bài viết</option>
              </select>
              <button>Thêm bài viết</button>
            </div>
            <table border={1}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tiêu đề</th>
                  <th>Hình ảnh</th>
                  <th>Ngày viết</th>
                  <th>Trạng thái</th>
                  <th>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {post.map((post, index) => (
                  <tr key={post.id}>
                    <td>{index + 1}</td>
                    <td>{post.title}</td>
                    <td>
                      <img src={post.image} alt={post.title} width="100" />
                    </td>
                    <td>{post.date}</td>
                    <td>
                      {post.status ? (
                        <button>Đã xuất bản</button>
                      ) : (
                        <button>Ngừng xuất bản</button>
                      )}
                    </td>
                    <td>
                      <button onClick={() => showModalBlock(post.id)}>Chặn</button>
                      <button>Sửa</button>
                      <button>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Xác nhận</h5>
              <i
                className="fas fa-xmark"
                onClick={() => setShowModal(false)}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="modal-body-custom">
              <p>Bạn chắc chắn muốn ngừng xuất bản bài viết?</p>
            </div>
            <div className="modal-footer-custom">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-light"
              >
                Hủy
              </button>
              <button onClick={confirmAction} className="btn btn-danger">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}