import React from "react";
import "../css/MemberList.css";

const MemberList = () => {
  return (
    <div className="">
      <h2 style={{ textAlign: 'center' }}>Member List</h2>

      {/* Member List */}
      <div className="container text-center my-4">
        <img src="../image/ThanhPhong.jpg" alt="Leader" className="img-fluid rounded" style={{ width: '256px', height: '256px' }} />
        <div className="caption">
          <p>Leader: Phạm Thanh Phong</p>
          <p>MSSV: 2212564</p>
        </div>
      </div>
      <div className="container my-4">
        <div className="row">
          <div className="col-md-4 mb-4 text-center">
            <img src="../image/NgocAnh.png" alt="Member 1" className="img-fluid rounded" style={{ width: '256px', height: '256px' }} />
            <div className="caption">
              <p>Member: Hoàng Thị Ngọc Anh</p>
              <p>MSSV: 2210053</p>
            </div>
          </div>
          <div className="col-md-4 mb-4 text-center">
            <img src="../image/TatLinh.jpg" alt="Member 2" className="img-fluid rounded" style={{ width: '256px', height: '256px' }} />
            <div className="caption">
              <p>Member: Nguyễn Tất Linh</p>
              <p>MSSV: 2113915</p>
            </div>
          </div>
          <div className="col-md-4 mb-4 text-center">
            <img src="../image/CongMinh.jpg" alt="Member 3" className="img-fluid rounded" style={{ width: '256px', height: '256px' }} />
            <div className="caption">
              <p>Member: Lê Công Minh</p>
              <p>MSSV: 2212044</p>
            </div>
          </div>
          <div className="col-md-4 mb-4 text-center">
            <img src="../image/DucPhat.png" alt="Member 4" className="img-fluid rounded" style={{ width: '256px', height: '256px' }} />
            <div className="caption">
              <p>Member: Võ Nguyễn Đức Phát</p>
              <p>MSSV: 2212540</p>
            </div>
          </div>
          <div className="col-md-4 mb-4 text-center">
            <img src="../image/MinhPhuc.jpg" alt="Member 5" className="img-fluid rounded" style={{ width: '256px', height: '256px' }} />
            <div className="caption">
              <p>Member: Phạm Minh Phúc</p>
              <p>MSSV: 2212645</p>
            </div>
          </div>
          <div className="col-md-4 mb-4 text-center">
            <img src="../image/VietQuang.jpg" alt="Member 6" className="img-fluid rounded" style={{ width: '256px', height: '256px' }} />
            <div className="caption">
              <p>Member: Nguyễn Bá Việt Quang</p>
              <p>MSSV: 2212741</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberList;