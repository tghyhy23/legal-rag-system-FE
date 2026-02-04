// src/services/mockLegalData.js

const SAMPLE_CONTENT = `
<div class="legal-content">
  <div style="text-align: center; margin-bottom: 20px;">
    <p><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></p>
    <p><strong>Độc lập - Tự do - Hạnh phúc</strong></p>
    <p>---------------</p>
  </div>
  
  <p style="text-align: center; font-weight: bold;">LUẬT/NGHỊ ĐỊNH/THÔNG TƯ</p>
  <p style="text-align: justify;"><em>Căn cứ Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam;</em></p>
  <p style="text-align: justify;"><em>Quốc hội ban hành Luật...</em></p>

  <h3 style="font-weight: bold; margin-top: 15px;">Chương I: NHỮNG QUY ĐỊNH CHUNG</h3>
  
  <p><strong>Điều 1. Phạm vi điều chỉnh</strong></p>
  <p>Luật này quy định về.....</p>

  <p><strong>Điều 2. Đối tượng áp dụng</strong></p>
  <p>1. Cơ quan, tổ chức, cá nhân....</p>
  <p>2. Người nước ngoài cư trú tại Việt Nam...</p>

  <h3 style="font-weight: bold; margin-top: 15px;">Chương II: QUY ĐỊNH CỤ THỂ</h3>
  
  <p><strong>Điều 3. Nguyên tắc xử lý</strong></p>
  <p>1. Mọi hành vi vi phạm pháp luật phải được phát hiện, ngăn chặn kịp thời....</p>
  <p>2. Việc xử lý vi phạm phải được tiến hành nhanh chóng, công minh, triệt để...</p>

  <p><em>(Đây là nội dung giả định phục vụ demo giao diện hiển thị văn bản toàn văn)</em></p>
</div>
`;

export const MOCK_DOCUMENTS = [
  {
    id: '1',
    number: '100/2015/QH13',
    type: 'Bộ luật',
    name: 'Bộ luật Hình sự 2015',
    issueDate: '27/11/2015',
    effectiveDate: '01/01/2018',
    status: 'Còn hiệu lực',
    signer: 'Nguyễn Sinh Hùng',
    summary: 'Quy định về tội phạm và hình phạt.',
    content: SAMPLE_CONTENT.replace('LUẬT/NGHỊ ĐỊNH/THÔNG TƯ', 'BỘ LUẬT HÌNH SỰ')
  },
  {
    id: '2',
    number: '12/2017/QH14',
    type: 'Luật',
    name: 'Luật sửa đổi, bổ sung một số điều của Bộ luật Hình sự số 100/2015/QH13',
    issueDate: '20/06/2017',
    effectiveDate: '01/01/2018',
    status: 'Còn hiệu lực',
    signer: 'Nguyễn Thị Kim Ngân',
    summary: 'Sửa đổi bổ sung các quy định quan trọng của BLHS 2015.',
    content: SAMPLE_CONTENT.replace('LUẬT/NGHỊ ĐỊNH/THÔNG TƯ', 'LUẬT SỬA ĐỔI, BỔ SUNG MỘT SỐ ĐIỀU CỦA BỘ LUẬT HÌNH SỰ')
  },
  {
    id: '3',
    number: '101/2015/QH13',
    type: 'Bộ luật',
    name: 'Bộ luật Tố tụng hình sự 2015',
    issueDate: '27/11/2015',
    effectiveDate: '01/01/2018',
    status: 'Còn hiệu lực',
    signer: 'Nguyễn Sinh Hùng',
    summary: 'Quy định trình tự, thủ tục giải quyết vụ án hình sự.',
    content: SAMPLE_CONTENT
  },
  {
    id: '4',
    number: '100/2019/NĐ-CP',
    type: 'Nghị định',
    name: 'Nghị định quy định xử phạt vi phạm hành chính trong lĩnh vực giao thông đường bộ và đường sắt',
    issueDate: '30/12/2019',
    effectiveDate: '01/01/2020',
    status: 'Hết hiệu lực',
    signer: 'Nguyễn Xuân Phúc',
    summary: 'Đã bị thay thế bởi Nghị định 123/2021/NĐ-CP.',
    content: SAMPLE_CONTENT
  },
  {
    id: '5',
    number: '123/2021/NĐ-CP',
    type: 'Nghị định',
    name: 'Nghị định sửa đổi, bổ sung một số điều của các Nghị định quy định xử phạt vi phạm hành chính trong lĩnh vực hàng hải; giao thông đường bộ, đường sắt; hàng không dân dụng',
    issueDate: '28/12/2021',
    effectiveDate: '01/01/2022',
    status: 'Còn hiệu lực',
    signer: 'Phạm Minh Chính',
    summary: 'Văn bản hiện hành về xử phạt giao thông.',
    content: SAMPLE_CONTENT
  },
  {
    id: '6',
    number: '10/2022/TT-BCA',
    type: 'Thông tư',
    name: 'Thông tư quy định về công tác nghiệp vụ cơ bản của lực lượng Cảnh sát nhân dân',
    issueDate: '15/01/2022',
    effectiveDate: '01/03/2022',
    status: 'Còn hiệu lực',
    signer: 'Tô Lâm',
    summary: 'Văn bản hướng dẫn nội bộ.',
    content: SAMPLE_CONTENT
  },
  {
    id: '7',
    number: '68/2024/QH15',
    type: 'Luật',
    name: 'Luật Công nghiệp quốc phòng, an ninh và động viên công nghiệp',
    issueDate: '27/06/2024',
    effectiveDate: '01/07/2025',
    status: 'Sắp có hiệu lực',
    signer: 'Trần Thanh Mẫn',
    summary: 'Quy định mới về công nghiệp an ninh.',
    content: SAMPLE_CONTENT
  },
  {
    id: '8',
    number: '05/2018/TT-BCA',
    type: 'Thông tư',
    name: 'Thông tư quy định về Căn cước công dân',
    issueDate: '01/02/2018',
    effectiveDate: '15/03/2018',
    status: 'Một phần hiệu lực',
    signer: 'Tô Lâm',
    summary: 'Liên quan đến Luật Căn cước mới.',
    content: SAMPLE_CONTENT
  },
  {
    id: '9',
    number: '23/2018/QH14',
    type: 'Luật',
    name: 'Luật An ninh mạng',
    issueDate: '12/06/2018',
    effectiveDate: '01/01/2019',
    status: 'Còn hiệu lực',
    signer: 'Nguyễn Thị Kim Ngân',
    summary: 'Quy định về bảo vệ an ninh quốc gia trên không gian mạng.',
    content: SAMPLE_CONTENT
  },
  {
    id: '10',
    number: '53/2022/NĐ-CP',
    type: 'Nghị định',
    name: 'Nghị định quy định chi tiết một số điều của Luật An ninh mạng',
    issueDate: '15/08/2022',
    effectiveDate: '01/10/2022',
    status: 'Còn hiệu lực',
    signer: 'Phạm Minh Chính',
    summary: 'Hướng dẫn thi hành Luật An ninh mạng.',
    content: SAMPLE_CONTENT
  },
  {
    id: '11',
    number: '01/2024/TT-BCA',
    type: 'Thông tư',
    name: 'Thông tư quy định mẫu thẻ Căn cước',
    issueDate: '01/01/2024',
    effectiveDate: '01/07/2024',
    status: 'Còn hiệu lực',
    signer: 'Tô Lâm',
    summary: 'Mẫu thẻ mới áp dụng từ 01/07/2024.',
    content: SAMPLE_CONTENT
  },
  {
    id: '12',
    number: '14/2014/QH13',
    type: 'Luật',
    name: 'Luật Tổ chức Viện kiểm sát nhân dân',
    issueDate: '24/11/2014',
    effectiveDate: '01/06/2015',
    status: 'Còn hiệu lực',
    signer: 'Nguyễn Sinh Hùng',
    summary: '',
    content: SAMPLE_CONTENT
  },
  {
    id: '13',
    number: '80/2013/NĐ-CP',
    type: 'Nghị định',
    name: 'Nghị định quy định về xử phạt vi phạm hành chính trong lĩnh vực tiêu chuẩn, đo lường và chất lượng sản phẩm, hàng hóa',
    issueDate: '19/07/2013',
    effectiveDate: '15/09/2013',
    status: 'Hết hiệu lực',
    signer: 'Nguyễn Tấn Dũng',
    summary: '',
    content: SAMPLE_CONTENT
  }
];