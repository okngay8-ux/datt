import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Thư mục lưu ảnh cắt từ PDF
const IMG_DIR = './public/images/vong2';
fs.mkdirSync(IMG_DIR, { recursive: true });

async function cropBox(pageNumber, left, top, width, height, outFile) {
  const src = `./public/images/pdf_pages/page_${pageNumber}.png`;
  if (!fs.existsSync(src)) return false;
  try {
    await sharp(src)
      .extract({ left: Math.round(left), top: Math.round(top), width: Math.round(width), height: Math.round(height) })
      .png({ quality: 90 })
      .toFile(outFile);
    return true;
  } catch (err) {
    console.error(`Crop error on page ${pageNumber} -> ${outFile}:`, err.message);
    return false;
  }
}

// ========================================================
// 1. CẮT ẢNH CÔNG CỤ (67 công cụ, trang 20-24)
// ========================================================
const TOOL_NAMES = [
  // Trang 20: 16 công cụ (5 cols, 4 rows)
  { kr: 'CO2용접기', vi: 'Máy hàn CO2', p: 20, r: 0, c: 0 },
  { kr: '벤딩기', vi: 'Máy đóng dây đai', p: 20, r: 0, c: 1 },
  { kr: '컨트롤 판넬', vi: 'Bảng điều khiển', p: 20, r: 0, c: 2 },
  { kr: '누전차단기', vi: 'Cầu dao điện / Cầu dao chống giật', p: 20, r: 0, c: 3 },
  { kr: '에어콤프레샤', vi: 'Máy nén khí', p: 20, r: 0, c: 4 },
  { kr: '호이스트', vi: 'Tời nâng / Pa lăng', p: 20, r: 1, c: 0 },
  { kr: '방청유', vi: 'Dầu bôi trơn chống rỉ (WD-40)', p: 20, r: 1, c: 1 },
  { kr: '원형톱', vi: 'Máy cưa đĩa tròn', p: 20, r: 1, c: 2 },
  { kr: '회로시험기', vi: 'Đồng hồ đo điện / Vạn năng kế', p: 20, r: 1, c: 3 },
  { kr: '버니어 캘리퍼스', vi: 'Thước cặp / Thước kẹp vernier', p: 20, r: 1, c: 4 },
  { kr: '지게차', vi: 'Xe nâng hàng', p: 20, r: 2, c: 0 },
  { kr: '대차', vi: 'Xe đẩy bàn chở hàng', p: 20, r: 2, c: 1 },
  { kr: '소켓 렌치', vi: 'Cần siết bu lông / Cờ lê tròng', p: 20, r: 2, c: 2 },
  { kr: '스패너', vi: 'Cờ lê', p: 20, r: 2, c: 3 },
  { kr: '작업등', vi: 'Đèn làm việc / Đèn soi xưởng', p: 20, r: 2, c: 4 },
  { kr: '파이프렌치', vi: 'Kìm nước / Cờ lê vặn ống nước', p: 20, r: 3, c: 0 },

  // Trang 21: 16 công cụ
  { kr: '공구함', vi: 'Hộp đựng dụng cụ / Hộp đồ nghề', p: 21, r: 0, c: 0 },
  { kr: '전기드릴', vi: 'Máy khoan điện', p: 21, r: 0, c: 1 },
  { kr: '핸드카', vi: 'Xe đẩy tay 2 bánh', p: 21, r: 0, c: 2 },
  { kr: '나사못', vi: 'Đinh vít / Vít bắt gỗ', p: 21, r: 0, c: 3 },
  { kr: '육각렌치', vi: 'Cờ lê lục giác', p: 21, r: 0, c: 4 },
  { kr: '바구니', vi: 'Giỏ nhựa đựng đồ', p: 21, r: 1, c: 0 },
  { kr: '전선 릴', vi: 'Cuộn dây cáp điện', p: 21, r: 1, c: 1 },
  { kr: '핸드파래트(파래트트럭)', vi: 'Xe nâng tay Pallet', p: 21, r: 1, c: 2 },
  { kr: '마대', vi: 'Bao tải / Bao bố đựng hàng', p: 21, r: 1, c: 3 },
  { kr: '암나사(너트), 수나사(볼트)', vi: 'Đai ốc (Ecu), Bu-lông', p: 21, r: 1, c: 4 },
  { kr: '파렛트', vi: 'Pallet kệ đỡ hàng', p: 21, r: 2, c: 0 },
  { kr: '사다리', vi: 'Thang chữ A', p: 21, r: 2, c: 1 },
  { kr: '스위치', vi: 'Công tắc điện / Nút bấm', p: 21, r: 2, c: 2 },
  { kr: '저울', vi: 'Cân đồng hồ', p: 21, r: 2, c: 3 },
  { kr: '멀티탭', vi: 'Ổ cắm điện nhiều lỗ', p: 21, r: 2, c: 4 },
  { kr: '박스(상자)', vi: 'Thùng giấy / Thùng carton', p: 21, r: 3, c: 0 },

  // Trang 22: 16 công cụ
  { kr: '망치', vi: 'Búa đóng đinh', p: 22, r: 0, c: 0 },
  { kr: '환풍기', vi: 'Quạt thông gió', p: 22, r: 0, c: 1 },
  { kr: '바이스', vi: 'Ê-tô kẹp gia công', p: 22, r: 0, c: 2 },
  { kr: '줄자', vi: 'Thước cuộn / Thước dây', p: 22, r: 0, c: 3 },
  { kr: '소화기', vi: 'Bình cứu hỏa / Bình chữa cháy', p: 22, r: 0, c: 4 },
  { kr: '드럼', vi: 'Thùng phi chứa chất lỏng', p: 22, r: 1, c: 0 },
  { kr: '비닐끈', vi: 'Dây nilon buộc hàng', p: 22, r: 1, c: 1 },
  { kr: '공구 캐비넷', vi: 'Tủ đựng dụng cụ cơ khí', p: 22, r: 1, c: 2 },
  { kr: '칼', vi: 'Dao rọc giấy / Dao cắt', p: 22, r: 1, c: 3 },
  { kr: '드라이버', vi: 'Tua vít (Tô vít)', p: 22, r: 1, c: 4 },
  { kr: '가위', vi: 'Kéo cắt', p: 22, r: 2, c: 0 },
  { kr: '톱', vi: 'Cưa tay', p: 22, r: 2, c: 1 },
  { kr: '펜치', vi: 'Kìm điện đa năng', p: 22, r: 2, c: 2 },
  { kr: '손전등', vi: 'Đèn pin cầm tay', p: 22, r: 2, c: 3 },
  { kr: '쓰레받기', vi: 'Hót rác / Xẻng rác', p: 22, r: 2, c: 4 },
  { kr: '니퍼', vi: 'Kìm cắt chân linh kiện / Kìm bấm', p: 22, r: 3, c: 0 },

  // Trang 23: 16 công cụ
  { kr: '테이프', vi: 'Băng dính dán thùng', p: 23, r: 0, c: 0 },
  { kr: '삽', vi: 'Cái xẻng', p: 23, r: 0, c: 1 },
  { kr: '프라이어', vi: 'Kìm mỏ nhọn / Kìm mỏ quạ', p: 23, r: 0, c: 2 },
  { kr: '그라인더', vi: 'Máy mài góc cầm tay', p: 23, r: 0, c: 3 },
  { kr: '줄', vi: 'Cây giũa mài kim loại', p: 23, r: 0, c: 4 },
  { kr: '방호덮개', vi: 'Vỏ che chắn bảo vệ máy', p: 23, r: 1, c: 0 },
  { kr: '에어건', vi: 'Súng xì khô / Súng thổi khí', p: 23, r: 1, c: 1 },
  { kr: '유압펌프', vi: 'Bơm thủy lực', p: 23, r: 1, c: 2 },
  { kr: '인두기', vi: 'Mỏ hàn thiếc', p: 23, r: 1, c: 3 },
  { kr: '혼합기', vi: 'Máy trộn nguyên liệu', p: 23, r: 1, c: 4 },
  { kr: '가스켓', vi: 'Gioăng đệm làm kín (Gasket)', p: 23, r: 2, c: 0 },
  { kr: '플랜지', vi: 'Mặt bích đường ống (Flange)', p: 23, r: 2, c: 1 },
  { kr: '수평기', vi: 'Thước thủy đo thăng bằng', p: 23, r: 2, c: 2 },
  { kr: '적외선 온도계', vi: 'Nhiệt kế hồng ngoại đo nhiệt độ', p: 23, r: 2, c: 3 },
  { kr: '클램프', vi: 'Cảo chữ C / Cái kẹp vam', p: 23, r: 2, c: 4 },
  { kr: '절연테이프', vi: 'Băng dính cách điện', p: 23, r: 3, c: 0 },

  // Trang 24: 3 công cụ
  { kr: '케이블타이', vi: 'Dây rút nhựa / Dây thít', p: 24, r: 0, c: 0 },
  { kr: '테프론 테이프', vi: 'Băng tan quấn ren chống rỉ nước', p: 24, r: 0, c: 1 },
  { kr: '경첩', vi: 'Bản lề cửa', p: 24, r: 0, c: 2 }
];

async function cropAllTools() {
  const colXs = [55, 365, 675, 985, 1295];
  const rowYs = [300, 715, 1130, 1545];
  const width = 240;
  const height = 240;

  for (let i = 0; i < TOOL_NAMES.length; i++) {
    const item = TOOL_NAMES[i];
    const x = colXs[item.c];
    const y = rowYs[item.r];
    const outFile = path.join(IMG_DIR, `tool_${i + 1}.png`);
    await cropBox(item.p, x, y, width, height, outFile);
    item.img = `/images/vong2/tool_${i + 1}.png`;
  }
  console.log(`Đã cắt xong ${TOOL_NAMES.length} ảnh công cụ.`);
}

// ========================================================
// 2. CẮT ẢNH THIẾT BỊ BẢO HỘ (15 đồ, trang 35)
// ========================================================
const SAFETY_EQUIPMENT = [
  { kr: '방수 앞치마', vi: 'Tạp dề chống thấm nước', r: 0, c: 0 },
  { kr: '안전모', vi: 'Mũ bảo hộ lao động', r: 0, c: 1 },
  { kr: '위생마스크', vi: 'Khẩu trang vệ sinh', r: 0, c: 2 },
  { kr: '위생장화', vi: 'Ủng vệ sinh chống nước', r: 0, c: 3 },
  { kr: '방진마스크', vi: 'Khẩu trang lọc bụi / phòng bụi', r: 0, c: 4 },
  { kr: '안전장갑', vi: 'Găng tay an toàn', r: 1, c: 0 },
  { kr: '위생모', vi: 'Mũ trùm đầu vệ sinh', r: 1, c: 1 },
  { kr: '작업복', vi: 'Quần áo bảo hộ lao động', r: 1, c: 2 },
  { kr: '보안경', vi: 'Kính bảo hộ che chắn mắt', r: 1, c: 3 },
  { kr: '안전화', vi: 'Giày bảo hộ mũi thép chống đinh', r: 1, c: 4 },
  { kr: '위생복', vi: 'Bộ quần áo vệ sinh xưởng', r: 2, c: 0 },
  { kr: '청력보호구(귀마개)', vi: 'Chụp tai / Nút tai chống ồn', r: 2, c: 1 },
  { kr: '안전대', vi: 'Dây đai an toàn trên cao', r: 2, c: 2 },
  { kr: '용접면', vi: 'Mặt nạ hàn bảo vệ mắt và mặt', r: 2, c: 3 },
  { kr: '위생장갑', vi: 'Găng tay vệ sinh cao su mỏng', r: 2, c: 4 }
];

async function cropSafetyEquipment() {
  const colXs = [55, 365, 675, 985, 1295];
  const rowYs = [300, 715, 1130];
  const width = 240;
  const height = 240;

  for (let i = 0; i < SAFETY_EQUIPMENT.length; i++) {
    const item = SAFETY_EQUIPMENT[i];
    const x = colXs[item.c];
    const y = rowYs[item.r];
    const outFile = path.join(IMG_DIR, `safety_${i + 1}.png`);
    await cropBox(35, x, y, width, height, outFile);
    item.img = `/images/vong2/safety_${i + 1}.png`;
  }
  console.log(`Đã cắt xong ${SAFETY_EQUIPMENT.length} ảnh thiết bị an toàn.`);
}

// ========================================================
// 3. CẮT ẢNH BIỂN BÁO (Trang 36-43)
// ========================================================
const SAFETY_SIGNS = [
  // Biển chỉ thị (Trang 36: 15 biển, Trang 37: 8 biển)
  { kr: '반사조끼를 착용하시오', vi: 'Hãy mặc áo phản quang', p: 36, r: 0, c: 0 },
  { kr: '머리 보호구를 착용하시오', vi: 'Hãy đội mũ bảo hộ bảo vệ đầu', p: 36, r: 0, c: 1 },
  { kr: '보호장갑을 착용하시오', vi: 'Hãy đeo găng tay bảo hộ', p: 36, r: 0, c: 2 },
  { kr: '경적을 울리시오', vi: 'Hãy bấm còi cảnh báo', p: 36, r: 0, c: 3 },
  { kr: '방호복을 착용하시오', vi: 'Hãy mặc trang phục bảo hộ', p: 36, r: 0, c: 4 },
  { kr: '불투명 보안대를 반드시 착용하시오', vi: 'Bắt buộc đeo kính an toàn mờ chống lóa', p: 36, r: 1, c: 0 },
  { kr: '귀마개를 착용하시오', vi: 'Hãy đeo nút bịt tai chống ồn', p: 36, r: 1, c: 1 },
  { kr: '보안경을 착용하시오', vi: 'Hãy đeo kính bảo hộ bảo vệ mắt', p: 36, r: 1, c: 2 },
  { kr: '사용설명서, 책자를 참조하십시오', vi: 'Hãy tham khảo sách hướng dẫn sử dụng', p: 36, r: 1, c: 3 },
  { kr: '마스크를 착용하시오', vi: 'Hãy đeo khẩu trang', p: 36, r: 1, c: 4 },
  { kr: '보호용 앞치마를 착용하시오', vi: 'Hãy mặc tạp dề bảo vệ', p: 36, r: 2, c: 0 },
  { kr: '손을 씻으시오', vi: 'Hãy rửa sạch tay', p: 36, r: 2, c: 1 },
  { kr: '손잡이를 사용하시오', vi: 'Hãy nắm vào tay vịn / tay cầm', p: 36, r: 2, c: 2 },
  { kr: '안전띠를 착용하시오', vi: 'Hãy cài dây an toàn', p: 36, r: 2, c: 3 },
  { kr: '얼굴 보호구를 착용하시오', vi: 'Hãy đeo mặt nạ bảo hộ che mặt', p: 36, r: 2, c: 4 },
  { kr: '용접마스크를 착용하시오', vi: 'Hãy đeo mặt nạ hàn', p: 36, r: 3, c: 0 },
  { kr: '잠그시오', vi: 'Hãy khóa chặt lại', p: 37, r: 0, c: 0 },
  { kr: '전기 플러그를 콘센트에서 분리하시오', vi: 'Hãy rút phích cắm điện ra khỏi ổ cắm', p: 37, r: 0, c: 1 },
  { kr: '안전벨트를 착용하시오', vi: 'Hãy thắt dây đai an toàn', p: 37, r: 0, c: 2 },
  { kr: '이 통로를 이용하시오', vi: 'Hãy đi theo lối đi an toàn này', p: 37, r: 0, c: 3 },
  { kr: '호흡기 보호장치를 착용하시오', vi: 'Hãy đeo thiết bị bảo hộ hô hấp (mặt nạ dưỡng khí)', p: 37, r: 0, c: 4 },
  { kr: '안전화를 착용하시오', vi: 'Hãy đi giày bảo hộ lao động', p: 37, r: 1, c: 0 },
  { kr: '일반적인 강제 행동 표시', vi: 'Biển báo hành động cưỡng chế chung', p: 37, r: 1, c: 1 },

  // Biển cảnh báo (Trang 38: 12 biển)
  { kr: '낙하(추락) 경고', vi: 'Cảnh báo nguy cơ rơi ngã', p: 38, r: 0, c: 0 },
  { kr: '미끄러운 표면 경고', vi: 'Cảnh báo bề mặt trơn trượt', p: 38, r: 0, c: 1 },
  { kr: '바닥면 장애물 경고', vi: 'Cảnh báo chướng ngại vật trên sàn', p: 38, r: 0, c: 2 },
  { kr: '인화물질 경고', vi: 'Cảnh báo vật liệu dễ cháy', p: 38, r: 0, c: 3 },
  { kr: '낙하물 경고', vi: 'Cảnh báo vật rơi từ trên cao', p: 38, r: 0, c: 4 },
  { kr: '일반 경고 표시', vi: 'Biển báo cảnh báo nguy hiểm chung', p: 38, r: 1, c: 0 },
  { kr: '독성 물질 경고', vi: 'Cảnh báo hóa chất độc hại', p: 38, r: 1, c: 1 },
  { kr: '방사능 물질 또는 이온화 방사선 경고', vi: 'Cảnh báo vật liệu phóng xạ hoặc bức xạ ion hóa', p: 38, r: 1, c: 2 },
  { kr: '전기 경고', vi: 'Cảnh báo nguy hiểm điện giật', p: 38, r: 1, c: 3 },
  { kr: '뜨거운 표면 경고', vi: 'Cảnh báo bề mặt nóng bỏng', p: 38, r: 1, c: 4 },
  { kr: '생물학적 위험 경고', vi: 'Cảnh báo mối nguy hiểm sinh học', p: 38, r: 2, c: 0 },
  { kr: '지게차와 산업용 운반기계 경고', vi: 'Cảnh báo xe nâng và máy vận chuyển công nghiệp', p: 38, r: 2, c: 1 },

  // Biển cấm (Trang 39-40: 29 biển)
  { kr: '금연, 담배를 피우지 마시오', vi: 'Cấm hút thuốc lá', p: 39, r: 0, c: 0 },
  { kr: '리프트 승객용으로 사용 금지', vi: 'Cấm dùng thang tời tải hàng cho hành khách', p: 39, r: 0, c: 1 },
  { kr: '밀지 마시오', vi: 'Cấm xô đẩy', p: 39, r: 0, c: 2 },
  { kr: '기대지 마시오', vi: 'Cấm dựa người vào', p: 39, r: 0, c: 3 },
  { kr: '만지지 마시오', vi: 'Cấm chạm sờ tay vào', p: 39, r: 0, c: 4 },
  { kr: '뛰지 마시오', vi: 'Cấm chạy nhảy', p: 39, r: 1, c: 0 },
  { kr: '물로 소화하지 마시오', vi: 'Cấm dập lửa bằng nước', p: 39, r: 1, c: 1 },
  { kr: '사진 촬영 금지', vi: 'Cấm quay phim, chụp ảnh', p: 39, r: 1, c: 2 },
  { kr: '손을 넣지 마시오', vi: 'Cấm thò tay vào khe máy', p: 39, r: 1, c: 3 },
  { kr: '로프에 매듭을 짓지 마시오', vi: 'Cấm thắt nút dây thừng', p: 39, r: 1, c: 4 },
  { kr: '물을 마시지 마시오', vi: 'Nước không uống được', p: 39, r: 2, c: 0 },
  { kr: '수영 금지', vi: 'Cấm bơi lội', p: 39, r: 2, c: 1 },
  { kr: '술 취한 사람 금지', vi: 'Cấm người say rượu vào', p: 39, r: 2, c: 2 },
  { kr: '앉지 마시오', vi: 'Cấm ngồi ở đây', p: 39, r: 2, c: 3 },
  { kr: '일반적인 금지표지', vi: 'Biểu tượng cấm chung', p: 39, r: 2, c: 4 },
  { kr: '스위치의 상태를 바꾸지 마시오', vi: 'Cấm thay đổi vị trí công tắc điện', p: 39, r: 3, c: 0 },
  { kr: '애견 금지', vi: 'Cấm mang theo thú cưng / chó mèo', p: 40, r: 0, c: 0 },
  { kr: '임산부 출입 금지', vi: 'Cấm phụ nữ có thai vào khu vực này', p: 40, r: 0, c: 1 },
  { kr: '식음료 금지', vi: 'Cấm mang đồ ăn thức uống', p: 40, r: 0, c: 2 },
  { kr: '올라가지 마시오', vi: 'Cấm leo trèo lên trên', p: 40, r: 0, c: 3 },
  { kr: '장갑을 착용하지 마시오', vi: 'Cấm đeo găng tay (khi thao tác máy quay)', p: 40, r: 0, c: 4 },
  { kr: '실외신발 금지', vi: 'Cấm đi giày dép ngoài trời vào xưởng', p: 40, r: 1, c: 0 },
  { kr: '의자를 흔들지 마시오', vi: 'Cấm lắc lư đu đưa ghế', p: 40, r: 1, c: 1 },
  { kr: '지게차, 산업용차량 접근 금지', vi: 'Cấm lại gần xe nâng và phương tiện công nghiệp', p: 40, r: 1, c: 2 },
  { kr: '착화 금지; 화재, 발화원과 발연 금지', vi: 'Cấm đánh lửa, cấm các nguồn sinh nhiệt và sinh khói', p: 40, r: 1, c: 3 },
  { kr: '휴대폰 사용 금지', vi: 'Cấm sử dụng điện thoại di động khi làm việc', p: 40, r: 1, c: 4 },
  { kr: '토트랙을 벗어나지 마시오', vi: 'Cấm đi lệch khỏi đường ray an toàn', p: 40, r: 2, c: 0 },
  { kr: '통행 금지', vi: 'Cấm đi lại qua lối này', p: 40, r: 2, c: 1 },
  { kr: '휴대용 그라인더에 사용하지 마시오', vi: 'Cấm sử dụng với máy mài cầm tay', p: 40, r: 2, c: 2 },

  // Biển báo khẩn cấp (Trang 41-42: 24 biển)
  { kr: '구급가방', vi: 'Túi / Hộp sơ cứu y tế cấp cứu', p: 41, r: 0, c: 0 },
  { kr: '들것', vi: 'Cáng cứu thương', p: 41, r: 0, c: 1 },
  { kr: '비상망치', vi: 'Búa thoát hiểm phá kính', p: 41, r: 0, c: 2 },
  { kr: '구명부이', vi: 'Phao cứu sinh hình tròn', p: 41, r: 0, c: 3 },
  { kr: '반시계방향 열림', vi: 'Mở theo chiều ngược kim đồng hồ', p: 41, r: 0, c: 4 },
  { kr: '시계방향으로 열림', vi: 'Mở theo chiều kim đồng hồ', p: 41, r: 1, c: 0 },
  { kr: '비상전화', vi: 'Điện thoại khẩn cấp', p: 41, r: 1, c: 1 },
  { kr: '구명조끼', vi: 'Áo phao cứu sinh', p: 41, r: 1, c: 2 },
  { kr: '비상구(오)', vi: 'Lối thoát hiểm khẩn cấp (hướng bên phải)', p: 41, r: 1, c: 3 },
  { kr: '비상구(왼)', vi: 'Lối thoát hiểm khẩn cấp (hướng bên trái)', p: 41, r: 1, c: 4 },
  { kr: '비상탈출용 호흡기', vi: 'Mặt nạ thở thoát hiểm khẩn cấp', p: 41, r: 2, c: 0 },
  { kr: '구조창문', vi: 'Cửa sổ cứu hộ khẩn cấp', p: 41, r: 2, c: 1 },
  { kr: '사다리가 있는 비상 창문', vi: 'Cửa sổ thoát hiểm có thang dây', p: 41, r: 2, c: 2 },
  { kr: '산소호흡기', vi: 'Bình thở oxy cấp cứu', p: 41, r: 2, c: 3 },
  { kr: '오른쪽 슬라이딩 도어', vi: 'Cửa trượt thoát hiểm bên phải', p: 41, r: 2, c: 4 },
  { kr: '왼쪽 슬라이딩 도어', vi: 'Cửa trượt thoát hiểm bên trái', p: 41, r: 3, c: 0 },
  { kr: '왼쪽으로 밀면 열리는 문', vi: 'Cửa đẩy mở về bên trái khi thoát nạn', p: 42, r: 0, c: 0 },
  { kr: '오른쪽으로 밀면 열리는 문', vi: 'Cửa đẩy mở về bên phải khi thoát nạn', p: 42, r: 0, c: 1 },
  { kr: '오른쪽으로 당기면 열리는 문', vi: 'Cửa kéo mở về bên phải', p: 42, r: 0, c: 2 },
  { kr: '왼쪽으로 당기면 열리는 문', vi: 'Cửa kéo mở về bên trái', p: 42, r: 0, c: 3 },
  { kr: '식수', vi: 'Nước uống sạch sinh hoạt', p: 42, r: 0, c: 4 },
  { kr: '응급처치', vi: 'Khu vực cấp cứu sơ cứu ban đầu', p: 42, r: 1, c: 0 },
  { kr: '심장박동기', vi: 'Máy khử rung tim tự động (AED)', p: 42, r: 1, c: 1 },
  { kr: '탈출사다리', vi: 'Thang thoát hiểm khẩn cấp', p: 42, r: 1, c: 2 },

  // Biển báo cháy (Trang 43: 7 biển)
  { kr: '방화문', vi: 'Cửa chống cháy ngăn khói', p: 43, r: 0, c: 0 },
  { kr: '소화전', vi: 'Cột họng nước chữa cháy', p: 43, r: 0, c: 1 },
  { kr: '소방사다리', vi: 'Thang cứu hỏa chữa cháy', p: 43, r: 0, c: 2 },
  { kr: '화재경보기', vi: 'Nút ấn chuông báo cháy khẩn cấp', p: 43, r: 0, c: 3 },
  { kr: '소방장비', vi: 'Trang thiết bị chữa cháy', p: 43, r: 0, c: 4 },
  { kr: '화재비상전화', vi: 'Điện thoại khẩn cấp báo cháy', p: 43, r: 1, c: 0 },
  { kr: '소화기', vi: 'Bình chữa cháy xách tay', p: 43, r: 1, c: 1 }
];

async function cropSafetySigns() {
  const colXs = [55, 365, 675, 985, 1295];
  const rowYs = [300, 715, 1130, 1545];
  const width = 240;
  const height = 240;

  for (let i = 0; i < SAFETY_SIGNS.length; i++) {
    const item = SAFETY_SIGNS[i];
    const x = colXs[item.c];
    const y = rowYs[item.r];
    const outFile = path.join(IMG_DIR, `sign_${i + 1}.png`);
    await cropBox(item.p, x, y, width, height, outFile);
    item.img = `/images/vong2/sign_${i + 1}.png`;
  }
  console.log(`Đã cắt xong ${SAFETY_SIGNS.length} ảnh biển báo an toàn.`);
}

export { cropAllTools, cropSafetyEquipment, cropSafetySigns, TOOL_NAMES, SAFETY_EQUIPMENT, SAFETY_SIGNS };
