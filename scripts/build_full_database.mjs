import fs from 'node:fs';
import path from 'node:path';
import { TOOL_NAMES, SAFETY_EQUIPMENT, SAFETY_SIGNS } from './crop_assets.mjs';

const SETS_FILE = './data/question_sets.json';

// Dữ liệu chi tiết 14 bộ câu hỏi phỏng vấn vòng 2 EPS-TOPIK 2026
const sets = [];

// ========================================================
// BỘ 1: GIỚI THIỆU BẢN THÂN (4 BÀI MẪU)
// ========================================================
sets.push({
  id: 'set_v2_01_gioithieu',
  title: '1. Giới thiệu bản thân (4 bài mẫu)',
  description: '4 bài mẫu tự giới thiệu bản thân chi tiết theo từng kinh nghiệm và hoàn cảnh',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: [
    {
      num: '1.',
      qKr: '자기 소개 1 (전자 제품 조립작업 5년 경력)',
      qVi: 'Bài mẫu 1: Kinh nghiệm 5 năm lắp ráp linh kiện điện tử',
      aKr: '안녕하십니까? 만나서 반갑습니다. 저는 베트남 랑썬에서 온 (프엉) 입니다. 올해 (34) 살입니다. 우리 가족은 모두 (4) 명입니다. 어머니와 누나, 남편, 그리고 저입니다. 제 취미는 독서입니다. 전에는 (전자 제품 조립작업) 을 5년 동안 했습니다. 제 생각에는 한국은 외국인 근로자를 위한 좋은 제도가 많이 있습니다. 그래서 한국에서 일하게 되기를 기대하고 있습니다. 뽑아주신다면 한국에 가서 열심히 일하겠습니다. 잘 부탁 드립니다. 감사합니다.',
      aVi: 'Xin chào! Rất vui được gặp bạn. Tôi là (Phượng), đến từ Lạng Sơn, Việt Nam. Năm nay tôi (34) tuổi. Gia đình tôi có tất cả (4) người: Mẹ, chị gái, chồng và tôi. Sở thích của tôi là đọc sách. Trước đây tôi đã làm việc (lắp ráp linh kiện điện tử) trong 5 năm. Tôi nghĩ Hàn Quốc có nhiều chế độ tốt cho lao động nước ngoài. Vì vậy tôi rất mong đợi được làm việc tại Hàn Quốc. Nếu được chọn, sang Hàn Quốc tôi sẽ làm việc thật chăm chỉ. Xin nhờ giúp đỡ. Xin cảm ơn.'
    },
    {
      num: '2.',
      qKr: '자기 소개 2 (가구공장 5년 경력 / 축구 좋아함)',
      qVi: 'Bài mẫu 2: Kinh nghiệm 5 năm xưởng gỗ / tính cẩn thận / thích đá bóng',
      aKr: '안녕하십니까? 만나서 반갑습니다. 저는 베트남 박장에서 온 (남) 입니다. 올해 (34) 살입니다. 우리 가족은 모두 (4) 명입니다. 어머니와 누나, 아내, 그리고 저입니다. 제 취미는 운동입니다. 특히 축구를 좋아합니다. 저는 일을 빨리 배우고 꼼꼼하게 일하는 것이 장점입니다. 저는 (가구공장) 에서 오년 동안 일했습니다. 한국에 취직하게 된다면 열심히 일하겠습니다. 여기까지 자기 소개를 마치겠습니다. 들어주셔서 감사합니다.',
      aVi: 'Xin chào! Rất vui được gặp bạn. Tôi là (Nam), đến từ Bắc Giang, Việt Nam. Năm nay tôi (34) tuổi. Gia đình tôi gồm (4) người: Mẹ, chị gái, vợ và tôi. Sở thích là thể thao, đặc biệt thích bóng đá. Ưu điểm của tôi là học việc nhanh và làm việc tỉ mỉ cẩn thận. Tôi từng làm ở (xưởng gỗ) 5 năm. Nếu được sang Hàn làm việc tôi sẽ rất chăm chỉ. Tôi xin kết thúc phần giới thiệu bản thân tại đây. Cảm ơn đã lắng nghe.'
    },
    {
      num: '3.',
      qKr: '자기 소개 3 (긍정적인 성격 / 기술 습득)',
      qVi: 'Bài mẫu 3: Tính cách tích cực / Học hỏi kỹ thuật giúp đỡ gia đình',
      aKr: '안녕하십니까? 만나서 반갑습니다. 제 이름은 (프엉) 이고 베트남에서 왔습니다. 올해 (34) 살입니다. 우리 가족은 모두 (3) 명입니다. 어머니와 남동생, 그리고 저입니다. 제 취미는 운동입니다. 특히 축구를 좋아합니다. 저는 모든 일에 대해 긍정적으로 생각하는 성격을 가지고 있습니다. 한국에 가서 열심히 일하고 기술을 배운 후 고향에 돌아가 가족의 삶에 도움이 되고 싶습니다. 귀사에 취직하여 열심히 일하고 싶습니다. 제게 기회를 주시면 감사하겠습니다. 진심으로 감사합니다.',
      aVi: 'Xin chào! Rất vui được gặp bạn. Tên tôi là (Phượng), đến từ Việt Nam. Năm nay tôi 34 tuổi. Gia đình tôi có 3 người: Mẹ, em trai và tôi. Sở thích là thể thao, đặc biệt thích bóng đá. Tính cách tôi luôn suy nghĩ tích cực trong mọi việc. Tôi muốn sang Hàn làm việc chăm chỉ, học kỹ thuật rồi về quê giúp đỡ gia đình. Nếu quý công ty cho tôi cơ hội tôi sẽ vô cùng biết ơn. Xin chân thành cảm ơn.'
    },
    {
      num: '4.',
      qKr: '자기 소개 4 (결혼 / 성실하고 책임감 있음)',
      qVi: 'Bài mẫu 4: Đã kết hôn / Chăm chỉ và có tinh thần trách nhiệm cao',
      aKr: '안녕하십니까? 처음 뵙겠습니다. 저는 베트남에서 온 (남) 입니다. 올해 (서른네) 살이고, 결혼했습니다. 우리 가족은 모두 (3) 명입니다. 어머니와 아내, 그리고 저입니다. 제 취미는 운동입니다. 특히 축구를 좋아합니다. 저는 일에 성실하고 책임감이 있는 사람입니다. 가족을 위해 한국에서 열심히 일하고 싶어서 지원하게 되었습니다. 합격하게 된다면 빠르게 업무를 익히고 성실하게 일하겠습니다. 잘 부탁드립니다. 감사합니다.',
      aVi: 'Xin chào quý vị! Tôi là Nam đến từ Việt Nam. Năm nay tôi 34 tuổi và đã lập gia đình. Gia đình tôi gồm 3 người: Mẹ, vợ và tôi. Sở thích là thể thao, đặc biệt là bóng đá. Tôi là người chăm chỉ và có tinh thần trách nhiệm trong công việc. Tôi ứng tuyển vì muốn làm việc chăm chỉ tại Hàn Quốc để lo cho gia đình. Nếu trúng tuyển, tôi sẽ học việc thật nhanh và làm việc trung thực, chăm chỉ. Xin nhờ giúp đỡ. Cảm ơn rất nhiều.'
    }
  ]
});

// ========================================================
// BỘ 2: VẤN ĐÁP CÁ NHÂN & ĐỜI SỐNG (50 CÂU)
// ========================================================
const VANDAP_50 = [
  ['이름이 뭐 예요?', 'Tên bạn là gì?', '제 이름은 (남)입니다.', 'Tên tôi là (Nam).'],
  ['나이가 어떻게 되세요?', 'Bạn bao nhiêu tuổi?', '저는 (서른네) 살입니다.', 'Tôi (34) tuổi.'],
  ['생일이 언제예요?', 'Sinh nhật của bạn khi nào?', '(천 구백 팔십 육)년 (사)월 (이)일입니다.', 'Ngày (2) tháng (4) năm (1986).'],
  ['고향이 어디예요?', 'Quê hương bạn ở đâu?', '제 고향은 (베트남 하남)입니다.', 'Quê tôi ở (Hà Nam, Việt Nam).'],
  ['가족은 몇명이에요?', 'Gia đình bạn có mấy người?', '우리 가족은 모두 (세)명입니다.', 'Gia đình tôi có tất cả (3) người.'],
  ['누구누구입니까? 누구누구예요?', '(Gia đình) Gồm những ai?', '(어머니, 누나)하고 저입니다.', 'Mẹ, chị gái và tôi.'],
  ['부모님이 계세요?', 'Bạn còn bố mẹ không?', '네, 계십니다. / 아니요, 돌아가셨습니다.', 'Vâng, bố mẹ tôi còn. / Dạ không, đã mất rồi ạ.'],
  ['형제가 몇명이 있습니까?', 'Bạn có mấy anh chị em?', '네, (두명)이 있습니다. (형 하나)하고 저입니다.', 'Vâng, có (2) người. (Một anh trai) và tôi.'],
  ['결혼했어요?', 'Bạn đã kết hôn chưa?', '네, 결혼했습니다. / 아니요, 결혼 안했습니다.', 'Vâng, tôi đã kết hôn rồi. / Chưa, tôi chưa kết hôn.'],
  ['아이가 있어요?', 'Bạn có con chưa?', '네, (아들 하나하고 딸 하나) 있습니다.', 'Vâng, tôi có (một con trai và một con gái).'],
  ['키가 얼마예요?', 'Chiều cao của bạn là bao nhiêu?', '(백육십오) 센티미터입니다.', '(165) cm ạ.'],
  ['몸 무게는 얼마나 되세요?', 'Bạn nặng bao nhiêu kg?', '(오십오) 킬로그램입니다.', '(55) kg ạ.'],
  ['오늘 무슨 요일이에요?', 'Hôm nay là thứ mấy?', '오늘은 (토요일)입니다.', 'Hôm nay là (thứ bảy).'],
  ['어제 무슨 요일이에요?', 'Hôm qua là thứ mấy?', '어제가 (금요일)입니다.', 'Hôm qua là (thứ sáu).'],
  ['내일 무슨 요일이에요?', 'Ngày mai là thứ mấy?', '내일은 (일요일)입니다.', 'Ngày mai là (chủ nhật).'],
  ['오늘 몇월 며칠이에요?', 'Hôm nay là ngày mấy tháng mấy?', '(유)월 (이십사)일입니다.', 'Ngày (24) tháng (6) ạ.'],
  ['내일 몇월 며칠이에요?', 'Ngày mai là ngày mấy tháng mấy?', '(유)월 (이십오)일입니다.', 'Ngày (25) tháng (6) ạ.'],
  ['어제 몇월 며칠이에요?', 'Hôm qua là ngày mấy tháng mấy?', '(유)월 (이십삼)일입니다.', 'Ngày (23) tháng (6) ạ.'],
  ['한국에 왜 가고 싶어요?', 'Tại sao bạn muốn đi Hàn Quốc?', '문화 체험을 하고 돈도 벌려고 합니다.', 'Tôi muốn trải nghiệm văn hóa và kiếm tiền giúp đỡ gia đình.'],
  ['요즘 무슨 일을 하세요?', 'Dạo này bạn làm công việc gì?', '전자 제품 조립작업을 하고 있습니다.', 'Tôi đang làm công việc lắp ráp sản phẩm điện tử.'],
  ['한국말을 잘 할수 있어요?', 'Bạn nói tốt tiếng Hàn không?', '아니요. 기초대화만 할수 있습니다.', 'Không ạ. Tôi chỉ có thể giao tiếp cơ bản thôi.'],
  ['무엇을 타고 왔어요?', 'Bạn đi gì đến đây?', '(오토바이, 택시, 자동차)를 타고 왔습니다.', 'Tôi đi bằng (xe máy / taxi / ô tô) đến.'],
  ['여기까지 얼마나 걸렸어요?', 'Mất bao lâu để đến đây?', '여기까지 한 시간 반 정도 걸렸습니다.', 'Đến đây mất khoảng 1 tiếng rưỡi ạ.'],
  ['전에 무슨 일을 했어요?', 'Trước đây bạn đã từng làm gì?', '(조선 선박)을 한 적이 있습니다.', 'Tôi từng làm việc ở (ngành đóng tàu).'],
  ['왜 우리가 당신을 고용해야 합니까?', 'Tại sao chúng tôi phải tuyển dụng bạn?', '저는 빠른 학습자이고 책임감이 있는 사람입니다.', 'Vì tôi học việc rất nhanh và là người có tinh thần trách nhiệm cao.'],
  ['외국에 가 본적이 있어요?', 'Bạn đã từng đi nước ngoài chưa?', '한국에 가본적이 있습니다. (가본적이 없습니다.)', 'Tôi từng đi Hàn Quốc rồi. (Tôi chưa từng đi nước ngoài bao giờ).'],
  ['무슨 운동을 좋아합니까?', 'Bạn thích môn thể thao nào?', '저는 배드민턴을 좋아합니다.', 'Tôi thích chơi cầu lông.'],
  ['취미가 뭐예요?', 'Sở thích của bạn là gì?', '제 취미는 운동입니다.', 'Sở thích của tôi là thể thao.'],
  ['한국말을 얼마 동안 배웠어요?', 'Bạn đã học tiếng Hàn trong bao lâu?', '(오) 개월 동안 공부했습니다.', 'Tôi đã học trong (5) tháng.'],
  ['한국어를 공부한지 얼마나 되었습니까?', 'Từ khi bạn học tiếng Hàn được bao lâu rồi?', '(이)년 정도 되었습니다.', 'Được khoảng (2) năm rồi ạ.'],
  ['한국어를 공부가 어떻습니까?', 'Bạn thấy việc học tiếng Hàn thế nào?', '한국어를 공부가 어렵지만 재미있습니다.', 'Học tiếng Hàn tuy khó nhưng rất thú vị.'],
  ['무슨 색깔을 좋아합니까?', 'Bạn thích màu gì?', '저는 (빨간색, 파란색, 녹색...)을 좋아합니다.', 'Tôi thích (màu đỏ / màu xanh lam / màu xanh lá...).'],
  ['어떤 계절을 좋아합니까?', 'Bạn thích mùa nào nhất?', '따뜻해서 봄을 제일 좋아합니다.', 'Tôi thích nhất mùa xuân vì thời tiết ấm áp.'],
  ['한국 친구가 있어요?', 'Bạn có bạn người Hàn Quốc không?', '네, 있습니다. / 아니요, 없습니다.', 'Vâng, tôi có. / Dạ không, tôi không có.'],
  ['아버지는 연세가 어떻게 되세요?', 'Bố bạn bao nhiêu tuổi rồi?', '아버지는 일흔 살입니다.', 'Bố tôi 70 tuổi ạ.'],
  ['어머니는 연세가 어떻게 되세요?', 'Mẹ bạn bao nhiêu tuổi rồi?', '어머니는 예순 네 살입니다.', 'Mẹ tôi 64 tuổi ạ.'],
  ['컴퓨터를 할 수 있어요?', 'Bạn có thể sử dụng máy tính không?', '네, 할 수 있습니다. (아니요, 할 수 없습니다.)', 'Vâng, tôi làm được. (Dạ không, tôi không biết dùng).'],
  ['어떤 한국 음식을 좋아하시나요?', 'Bạn thích món ăn nào của Hàn Quốc?', '유명해서 불고기를 제일 좋아합니다.', 'Tôi thích nhất món thịt nướng Bulgogi vì rất nổi tiếng.'],
  ['시간이 있을 때 무엇을 하고 싶습니까?', 'Khi có thời gian rảnh bạn muốn làm gì?', '운동하고 한국어를 공부하고 싶습니다.', 'Tôi muốn tập thể dục và học thêm tiếng Hàn.'],
  ['한국의 수도가 무엇입니까?', 'Thủ đô của Hàn Quốc là gì?', '한국 수도는 서울입니다.', 'Thủ đô của Hàn Quốc là Seoul.'],
  ['한국의 전통 옷은 무엇입니까?', 'Áo truyền thống của Hàn Quốc là gì?', '한복입니다.', 'Là áo Hanbok.'],
  ['아침에 무엇을 먹었습니까?', 'Buổi sáng bạn đã ăn gì?', '볶음밥을 먹었습니다.', 'Tôi đã ăn cơm rang.'],
  ['한국에서 어느 쪽으로 일을 하고 싶습니까?', 'Bạn muốn làm việc bên ngành nào tại Hàn Quốc?', '제조업 쪽으로 일을 하고 싶습니다.', 'Tôi muốn làm việc bên ngành sản xuất chế tạo.'],
  ['가족 중에 한국에서 일하는 사람이 있습니까?', 'Trong gia đình bạn có người đang làm việc tại Hàn Quốc không?', '네, 형은 한국에서 일하는 지 삼년 되었습니다.', 'Vâng, anh trai tôi làm việc ở Hàn Quốc được 3 năm rồi.'],
  ['지금 몇시예요?', 'Bây giờ là mấy giờ?', '지금 (오전 10시 30분)입니다.', 'Bây giờ là (10 giờ 30 phút sáng).'],
  ['한국에 가면 어떤 일을 하고 싶어요?', 'Nếu đi Hàn Quốc bạn muốn làm công việc gì?', '제 생각에는 어떤 일이 다 좋겠습니다. 그래서 어떤 일을 하게 되면 최선 다 하겠습니다.', 'Theo tôi công việc nào cũng tốt. Vì vậy dù được giao việc gì tôi cũng sẽ cố gắng hết sức.'],
  ['오늘 날씨가 어때요?', 'Hôm nay thời tiết thế nào?', '비가 조금 내리고 시원합니다. (햇빛 강하고 맑습니다.)', 'Trời mưa nhỏ và mát mẻ. (Trời nắng gắt và quang đãng).'],
  ['어디에서 한국어를 공부했어요?', 'Bạn đã học tiếng Hàn ở đâu?', '인터넷에서 자기로 온라인 공부했습니다. (Bắc giang 한국어 학원에서 공부했습니다.)', 'Tôi tự học online trên mạng. (Tôi học ở trung tâm tiếng Hàn Bắc Giang).'],
  ['한국문화에 대해 아는 게 있습니까?', 'Bạn có hiểu biết gì về văn hóa Hàn Quốc không?', '한국 사람들은 인사할 때 허리를 숙여 합니다. 술을 마실 때 고개를 옆에 돌려야 합니다.', 'Người Hàn Quốc khi chào hỏi cúi gập lưng. Khi uống rượu với người lớn tuổi phải quay mặt sang một bên.'],
  ['한국에 대해 아는게 있어요?', 'Bạn biết điều gì về đất nước Hàn Quốc?', '한국은 아름다운 나라이고 경제가 발전한 나라였습니다. 한국 사람들은 친절합니다. 유명한 관광지가 남이섬, 경복궁 등이 많이 있습니다. 전통옷은 한복입니다...', 'Hàn Quốc là đất nước tươi đẹp có nền kinh tế phát triển. Người dân rất thân thiện. Có nhiều điểm du lịch nổi tiếng như đảo Nami, cung điện Gyeongbokgung. Trang phục truyền thống là Hanbok...']
];

sets.push({
  id: 'set_v2_02_vandap_canhan',
  title: '2. Vấn đáp cá nhân & Đời sống (50 câu)',
  description: '50 câu hỏi đáp phỏng vấn về thông tin bản thân, gia đình, sở thích và văn hóa Hàn Quốc',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: VANDAP_50.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: item[0],
    qVi: item[1],
    aKr: item[2],
    aVi: item[3]
  }))
});

// ========================================================
// BỘ 3: KỸ NĂNG ỨNG XỬ NƠI LÀM VIỆC (47 CÂU)
// ========================================================
const UNG_XU_47 = [
  ['직장 동료하고 어떻게 지낼거예요?', 'Bạn sẽ đối xử với đồng nghiệp như thế nào?', '배려하면서 즐겁게 지낼겁니다. 바쁘면 도와줄게요.', 'Tôi sẽ quan tâm và hòa đồng vui vẻ. Nếu đồng nghiệp bận tôi sẽ giúp đỡ.'],
  ['직장 동료가 바쁘면 어떻게 할거예요?', 'Nếu đồng nghiệp bận, bạn sẽ làm gì?', '제 일이 끝나면 즐겁게 도와줄게요.', 'Khi xong việc của mình tôi sẽ vui vẻ hỗ trợ họ.'],
  ['동료와 갈등이 있으면 어떻게 할거예요?', 'Nếu có mâu thuẫn với đồng nghiệp thì bạn sẽ làm gì?', '동료 이야기를 잘 듣고 적극적으로 대화해서 빨리 화해하겠습니다.', 'Tôi sẽ lắng nghe đồng nghiệp và tích cực nói chuyện để nhanh chóng làm hòa.'],
  ['새로운 동료들과 잘 지내기 위해 무엇을 합니까?', 'Bạn sẽ làm gì để hòa hợp với đồng nghiệp mới?', '먼저 인사를 잘하고 대화를 시도해서 서로를 알아가려고 합니다.', 'Tôi sẽ chủ động chào hỏi và bắt chuyện để đôi bên hiểu nhau hơn.'],
  ['동료와 의견이 다르면 어떻게 할거예요?', 'Nếu bạn có ý kiến khác với đồng nghiệp thì sao?', '상대방의 의견을 듣고 솔직하게 대화하여 해결하려고 합니다.', 'Tôi sẽ lắng nghe ý kiến của đối phương và thẳng thắn trao đổi để giải quyết.'],
  ['직장에서 좋은 관계를 유지하려면 어떻게 해야 합니까?', 'Làm sao để duy trì mối quan hệ tốt tại nơi làm việc?', '항상 존중하고 필요할 때 서로 도와줍니다.', 'Luôn tôn trọng lẫn nhau và sẵn sàng giúp đỡ khi cần thiết.'],
  ['동료가 실수하면 어떻게 합니까?', 'Nếu đồng nghiệp mắc lỗi thì bạn sẽ làm gì?', '감정을 상하지 않도록 부드럽게 조언합니다.', 'Tôi sẽ góp ý nhẹ nhàng khéo léo để không làm tổn thương họ.'],
  ['동료가 어려움을 겪으면 어떻게 합니까?', 'Nếu đồng nghiệp gặp khó khăn thì bạn sẽ làm gì?', '먼저 상태를 물어보고 도와줄 수 있는 부분은 돕습니다.', 'Trước tiên tôi sẽ hỏi thăm tình hình và giúp đỡ những phần mình có thể.'],
  ['친구가 근무 중 개인 일을 하자고 하면 어떻게 합니까?', 'Nếu bạn bè rủ làm việc riêng trong giờ làm thì bạn làm gì?', '정중히 거절하고 업무에 집중합니다.', 'Tôi sẽ lịch sự từ chối và tập trung vào công việc.'],
  ['상사가 당신 의견에 반대하면 어떻게 할거예요?', 'Nếu cấp trên không đồng ý với ý kiến của bạn thì sao?', '잘 못한 것을 사과하고 다시 지시는 대로 하겠습니다.', 'Tôi sẽ nhận lỗi về phần chưa đúng và làm theo đúng chỉ thị của cấp trên.'],
  ['해결 방법을 모를 때는 어떻게 합니까?', 'Khi không biết cách giải quyết thì bạn sẽ làm gì?', '경험 많은 분께 묻거나 관련 정보를 찾아봅니다.', 'Tôi sẽ hỏi người có kinh nghiệm hoặc tìm hiểu thông tin liên quan.'],
  ['문제가 생기면 해결책을 찾기 위해 어떻게 노력하실 건가요?', 'Nếu phát sinh vấn đề bạn làm gì để tìm phương pháp giải quyết?', '문제를 분석하고, 최선의 해결책을 찾기 위해 동료, 상사와 함께 협력한다.', 'Tôi sẽ phân tích vấn đề và phối hợp với đồng nghiệp, cấp trên để tìm phương án tối ưu.'],
  ['다른 사람들과 잘 지내는 것이 왜 중요하다고 생각하세요?', 'Bạn có nghĩ là việc hòa đồng với người khác quan trọng?', '네, 업무 효율을 높이고, 긍정적인 근무 환경을 만들거든요.', 'Vâng, vì nó giúp nâng cao hiệu quả công việc và tạo môi trường làm việc tích cực.'],
  ['의사소통이 왜 중요한지 설명할 수 있나요?', 'Bạn cho biết tại sao giao tiếp lại quan trọng?', '서로 이해하고, 오해를 줄일 수 있습니다.', 'Vì giao tiếp giúp đôi bên thấu hiểu nhau và giảm bớt những hiểu lầm.'],
  ['의사소통을 방해하는 요소들은 무엇이 있나요?', 'Những yếu tố nào gây ảnh hưởng xấu đến giao tiếp?', '오해, 감정적 상태 등이 방해 요소가 될 수 있다고 생각합니다.', 'Tôi nghĩ sự hiểu lầm và trạng thái cảm xúc tiêu cực là rào cản lớn.'],
  ['팀에서 효과적인 소통은 무엇입니까?', 'Giao tiếp hiệu quả trong nhóm là gì?', '잘 듣고, 필요한 말만 명확히 전달하는 것입니다.', 'Là lắng nghe cẩn thận và truyền đạt rõ ràng, đúng trọng tâm.'],
  ['사람들 사이에서 지켜야 할 예절에 대해 잘 알고 있나요?', 'Bạn có nắm rõ các phép tắc trong giao tiếp không?', '네, 예의와 존중을 바탕으로 소통하고, 상대방을 배려하는 것이 중요하다.', 'Vâng, giao tiếp trên nền tảng lễ phép, tôn trọng và biết nghĩ cho đối phương.'],
  ['일하면서 정해진 시간을 잘 지키시나요?', 'Bạn có tuân thủ thời gian làm việc không?', '네, 시간을 잘 지켜서 업무 효율을 높이고, 신뢰를 만듭니다.', 'Vâng, tôi luôn đúng giờ để nâng cao năng suất và tạo dựng lòng tin.'],
  ['두 가지 방법 중 선택할 때는 어떻게 합니까?', 'Khi chọn giữa hai phương án, bạn làm sao?', '각각의 장단점을 비교하고 가장 효율적인 방법을 선택합니다.', 'Tôi so sánh ưu nhược điểm của từng phương án rồi chọn cách tối ưu nhất.'],
  ['작업하다가 실수하면 어떻게 할거예요?', 'Nếu bạn làm sai trong lúc làm việc thì sao?', '상사(관리자)에게 보고하고 앞으로 다시 실수하지 않게 노력합니다.', 'Tôi sẽ báo ngay cho cấp trên (quản lý) và nỗ lực không để tái phạm.'],
  ['작업하다가 사고가 나면 어떻게 할거예요?', 'Nếu xảy ra tai nạn khi làm việc thì sao?', '큰 소리로 외치고 옆동료를 부르고 관리자에게 빨리 보고하겠습니다.', 'Tôi sẽ hô to gọi đồng nghiệp xung quanh và lập tức báo ngay cho quản lý.'],
  ['불량품이 많이 나면 어떻게 할거예요?', 'Nếu ra nhiều sản phẩm lỗi thì sao?', '먼저 기계를 정지하고 (스위치를 끄고) 빨리 관리자에게 보고하겠습니다.', 'Trước tiên tôi tắt máy dừng lại rồi lập tức báo cáo cho quản lý.'],
  ['문제가 생겼을 때 누구에게 먼저 보고합니까?', 'Nếu phát sinh vấn đề bạn báo cáo cho ai đầu tiên?', '관리자에게 보고합니다.', 'Tôi báo cáo cho người quản lý đầu tiên.'],
  ['작업 중 문제가 반복되면 어떻게 하시겠습니까?', 'Trong công việc nếu vấn đề phát sinh lặp đi lặp lại thì bạn xử lý sao?', '문제가 반복되면 관리자에게 보고합니다.', 'Nếu vấn đề lặp lại tôi sẽ báo cáo cấp quản lý để có giải pháp triệt để.'],
  ['이 일에 필요한 기술이 있습니까?', 'Bạn có kỹ năng cần thiết cho công việc này không?', '기본적인 기계를 다룰 수 있고 작업 절차를 잘 이해하고 있습니다.', 'Tôi sử dụng được các máy cơ bản và nắm rõ quy trình thao tác.'],
  ['기술을 어떻게 향상시키나요?', 'Bạn làm thế nào để nâng cao kỹ năng?', '책이나 영상으로 공부하고 선배에게 배웁니다.', 'Tôi học qua tài liệu, video và học hỏi kinh nghiệm từ các tiền bối.'],
  ['새로운 기계를 만나면 어떻게 합니까?', 'Khi gặp máy mới, bạn làm gì?', '설명서를 꼼꼼히 읽고 안전하게 사용하는 방법을 익힙니다.', 'Tôi đọc kỹ sách hướng dẫn và học cách vận hành an toàn.'],
  ['기술적인 문제가 생기면 어떻게 합니까?', 'Nếu có sự cố kỹ thuật thì bạn làm gì?', '바로 작업을 멈추고 관리자에게 보고합니다.', 'Tôi dừng công việc ngay lập tức và báo cáo cho quản lý.'],
  ['한국에서 사용할 수 있는 기술이 있어요?', 'Bạn có kỹ năng có thể dùng ở Hàn Quốc không?', '저는 전자 제품 조립작업을 (4년) 동안 했는데 관련 일을 할 수 있습니다.', 'Tôi có 4 năm kinh nghiệm lắp ráp điện tử nên làm tốt việc liên quan.'],
  ['다른 사람보다 잘 할수 있는 기술이 있어요?', 'Bạn có kỹ năng nào làm tốt hơn người khác không?', '저는 빠른 학습자이고 꼼꼼히 일합니다.', 'Tôi tiếp thu rất nhanh và làm việc tỉ mỉ cẩn thận.'],
  ['새로운 장비를 사용할 줄 모를 때는 어떻게 합니까?', 'Khi chưa biết cách sử dụng trang thiết bị mới bạn làm gì?', '설명서를 읽고 선배에게 배우며 안전하게 사용법을 익힙니다.', 'Tôi đọc hướng dẫn sử dụng và nhờ tiền bối chỉ dạy để dùng an toàn.'],
  ['작업 중 도구가(기계) 고장나면 어떻게 하시겠습니까?', 'Đang làm nếu công cụ, máy móc bị hỏng thì bạn làm thế nào?', '도구가(기계) 고장나면 바로 중단하고 관리자에게 보고하겠습니다.', 'Tôi sẽ dừng ngay lại và báo cáo ngay cho quản lý.'],
  ['업무를 잘 이해하지 못했을 때는 어떻게 합니까?', 'Nếu bạn chưa hiểu rõ công việc thì bạn sẽ làm gì?', '정확히 이해할 때까지 다시 묻습니다.', 'Tôi sẽ hỏi lại cho đến khi hiểu thật chính xác mới làm.'],
  ['상대가 내 말을 안 들으면 어떻게 합니까?', 'Nếu đối phương không nghe bạn thì làm gì?', '더 쉽게 설명하고 부드럽게 다시 말합니다.', 'Tôi sẽ giải thích đơn giản hơn và nói lại một cách nhẹ nhàng.'],
  ['논쟁이 있을 때는 어떻게 합니까?', 'Khi có tranh luận, bạn làm gì?', '감정을 자제하고 논리적으로 이야기합니다.', 'Tôi kiềm chế cảm xúc và nói chuyện dựa trên lý lẽ.'],
  ['팀에서 오해가 생기면 어떻게 해결합니까?', 'Nếu có hiểu lầm trong nhóm thì bạn làm gì?', '오해가 생기면 먼저 이야기해서 풀려고 합니다.', 'Tôi sẽ chủ động trò chuyện để tháo gỡ hiểu lầm.'],
  ['다른 사람의 의견을 잘 듣는 편입니까?', 'Bạn có phải tuýp người biết lắng nghe?', '네, 다른 사람의 의견도 잘 듣는 편입니다.', 'Vâng, tôi là người luôn biết lắng nghe ý kiến người khác.'],
  ['상사에게 건의할 일이 있으면 어떻게 합니까?', 'Nếu có kiến nghị thì bạn làm sao?', '건의사항이 있으면 예의 있게 말씀드립니다.', 'Tôi sẽ trình bày ý kiến một cách lịch sự, đúng mực.'],
  ['근무시간 중에 외출해야 할 경우에는 어떻게 합니까?', 'Nếu bận cần ra ngoài trong giờ làm thì làm gì?', '상사에게 보고해서 허락을 받고 나가야 합니다.', 'Tôi phải báo cáo cấp trên và được cho phép mới được ra ngoài.'],
  ['회사가 월급을 안 주면 어떻게 합니까?', 'Nếu công ty không trả lương thì bạn sẽ làm gì?', '먼저 사무실에 올라가서 이유를 물어보고, 계속 성실히 일하면서 답변을 기다리겠습니다.', 'Trước tiên tôi lên văn phòng hỏi lý do, và vẫn chăm chỉ làm việc trong lúc chờ câu trả lời.'],
  ['모르는 일이 있으면 어떻게 합니까?', 'Nếu có việc không biết thì bạn làm gì?', '선배나 관리자에게 물어보고 배우겠습니다.', 'Tôi sẽ hỏi tiền bối hoặc người quản lý để học hỏi.'],
  ['직장에서 가장 중요한 것은 무엇이라고 생각합니까?', 'Bạn nghĩ điều gì là quan trọng nhất ở nơi làm việc?', '시간 약속, 정직함, 책임감이 가장 중요하다고 생각합니다.', 'Tôi nghĩ đúng giờ, trung thực và tinh thần trách nhiệm là quan trọng nhất.'],
  ['누군가 규정을 어기면 어떻게 합니까?', 'Nếu ai đó vi phạm quy định thì sao?', '관리자에게 보고하겠습니다.', 'Tôi sẽ báo cáo cho quản lý.'],
  ['피곤해도 일을 성실히 합니까?', 'Bạn có làm việc chăm chỉ dù mệt không?', '네, 피곤해도 끝까지 최선을 다하겠습니다.', 'Vâng, dù mệt tôi vẫn nỗ lực hết mình đến cùng.'],
  ['실수하면 책임지시겠습니까?', 'Nếu phạm sai lầm, bạn có chịu trách nhiệm không?', '네, 잘못을 인정하고 바로잡겠습니다.', 'Vâng, tôi sẵn sàng nhận lỗi và khắc phục sai sót ngay.'],
  ['회사에 일이 많으면 어떻게 할거예요?', 'Nếu công ty nhiều việc bạn sẽ làm gì?', '맡은 일은 빨리 끝내고 추가 업무도 열심히 하겠습니다.', 'Tôi sẽ hoàn thành nhanh việc được giao và sẵn sàng tăng ca chăm chỉ.'],
  ['맡겼는 일이 끝나면 뭐 할거예요?', 'Nếu xong việc của mình, bạn sẽ làm gì?', '작업장을 정리하거나 다른 일을 도울 준비를 하겠습니다.', 'Tôi sẽ dọn dẹp nơi làm việc hoặc sẵn sàng hỗ trợ các công việc khác.']
];

sets.push({
  id: 'set_v2_03_ungxu',
  title: '3. Ứng xử nơi làm việc (47 câu)',
  description: '47 câu hỏi tình huống giao tiếp, giải quyết mâu thuẫn, sự cố máy móc và văn hóa xưởng sản xuất',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: UNG_XU_47.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: item[0],
    qVi: item[1],
    aKr: item[2],
    aVi: item[3]
  }))
});

// ========================================================
// BỘ 4: TÍNH TOÁN & QUY ĐỔI ĐƠN VỊ (36 CÂU)
// ========================================================
const TINH_TOAN_36 = [
  // 10 câu tính nhẩm (trang 14)
  ['(200) 더하기 (300)은 얼마예요?', '200 cộng 300 là bao nhiêu?', '오 백입니다.', 'Là 500 ạ.'],
  ['(250) 더하기 (100)은 얼마예요?', '250 cộng 100 là bao nhiêu?', '삼 백 오십입니다.', 'Là 350 ạ.'],
  ['(8) 곱하기 (9)은 얼마예요?', '8 nhân 9 là bao nhiêu?', '칠십이입니다.', 'Là 72 ạ.'],
  ['(5) 곱하기 (6)은 얼마예요?', '5 nhân 6 là bao nhiêu?', '삼십입니다.', 'Là 30 ạ.'],
  ['(100) 빼기 (35)은 얼마예요?', '100 trừ 35 là bao nhiêu?', '육십오입니다.', 'Là 65 ạ.'],
  ['(50) 빼기 (30)은 얼마예요?', '50 trừ 30 là bao nhiêu?', '이십입니다.', 'Là 20 ạ.'],
  ['(60) 나누기 (15)은 얼마예요?', '60 chia 15 là bao nhiêu?', '사입니다.', 'Là 4 ạ.'],
  ['(40) 나누기 (8)은 얼마예요?', '40 chia 8 là bao nhiêu?', '오입니다.', 'Là 5 ạ.'],
  ['1 킬로그램은 몇 그램입니까?', '1 kg là bao nhiêu gam?', '천 그램입니다.', 'Là 1000 gam ạ.'],
  ['1 미터는 몇 센티미터입니까?', '1 mét là bao nhiêu cm?', '백 센티미터입니다.', 'Là 100 cm ạ.'],

  // 26 câu quy đổi đơn vị (trang 17-19)
  ['한 시간은 몇 분입니까?', '1 giờ bằng bao nhiêu phút?', '60 분입니다.', 'Là 60 phút ạ.'],
  ['1 미터는 몇 센티미터입니까?', '1m bằng bao nhiêu cm?', '100 센티미터입니다.', 'Là 100 cm ạ.'],
  ['2 미터는 몇 센티미터입니까?', '2m bằng bao nhiêu cm?', '200 센티미터입니다.', 'Là 200 cm ạ.'],
  ['3 미터는 몇 센티미터입니까?', '3m bằng bao nhiêu cm?', '300 센티미터입니다.', 'Là 300 cm ạ.'],
  ['4 미터는 몇 센티미터입니까?', '4m bằng bao nhiêu cm?', '400 센티미터입니다.', 'Là 400 cm ạ.'],
  ['5 미터는 몇 센티미터입니까?', '5m bằng bao nhiêu cm?', '500 센티미터입니다.', 'Là 500 cm ạ.'],
  ['1 미터는 몇 미니미터입니까?', '1m bằng bao nhiêu mm?', '1000 미니미터입니다.', 'Là 1000 mm ạ.'],
  ['2 미터는 몇 미니미터입니까?', '2m bằng bao nhiêu mm?', '2000 미니미터입니다.', 'Là 2000 mm ạ.'],
  ['3 미터는 몇 미니미터입니까?', '3m bằng bao nhiêu mm?', '3000 미니미터입니다.', 'Là 3000 mm ạ.'],
  ['4 미터는 몇 미니미터입니까?', '4m bằng bao nhiêu mm?', '4000 미니미터입니다.', 'Là 4000 mm ạ.'],
  ['5 미터는 몇 미니미터입니까?', '5m bằng bao nhiêu mm?', '5000 미니미터입니다.', 'Là 5000 mm ạ.'],
  ['1 센티미터는 몇 미니미터입니까?', '1cm bằng bao nhiêu mm?', '10 미니미터입니다.', 'Là 10 mm ạ.'],
  ['2 센티미터는 몇 미니미터입니까?', '2cm bằng bao nhiêu mm?', '20 미니미터입니다.', 'Là 20 mm ạ.'],
  ['3 센티미터는 몇 미니미터입니까?', '3cm bằng bao nhiêu mm?', '30 미니미터입니다.', 'Là 30 mm ạ.'],
  ['4 센티미터는 몇 미니미터입니까?', '4cm bằng bao nhiêu mm?', '40 미니미터입니다.', 'Là 40 mm ạ.'],
  ['5 센티미터는 몇 미니미터입니까?', '5cm bằng bao nhiêu mm?', '50 미니미터입니다.', 'Là 50 mm ạ.'],
  ['1 킬로그램은 몇 그램입니까?', '1kg bằng bao nhiêu gam?', '1000 그램입니다.', 'Là 1000 gam ạ.'],
  ['2 킬로그램은 몇 그램입니까?', '2kg bằng bao nhiêu gam?', '2000 그램입니다.', 'Là 2000 gam ạ.'],
  ['3 킬로그램은 몇 그램입니까?', '3kg bằng bao nhiêu gam?', '3000 그램입니다.', 'Là 3000 gam ạ.'],
  ['4 킬로그램은 몇 그램입니까?', '4kg bằng bao nhiêu gam?', '4000 그램입니다.', 'Là 4000 gam ạ.'],
  ['5 킬로그램은 몇 그램입니까?', '5kg bằng bao nhiêu gam?', '5000 그램입니다.', 'Là 5000 gam ạ.'],
  ['1 리터는 몇 미니리터입니까?', '1 lít bằng bao nhiêu mililít?', '1000 미니리터입니다.', 'Là 1000 ml ạ.'],
  ['2 리터는 몇 미니리터입니까?', '2 lít bằng bao nhiêu mililít?', '2000 미니리터입니다.', 'Là 2000 ml ạ.'],
  ['3 리터는 몇 미니리터입니까?', '3 lít bằng bao nhiêu mililít?', '3000 미니리터입니다.', 'Là 3000 ml ạ.'],
  ['4 리터는 몇 미니리터입니까?', '4 lít bằng bao nhiêu mililít?', '4000 미니리터입니다.', 'Là 4000 ml ạ.'],
  ['5 리터는 몇 미니리터입니까?', '5 lít bằng bao nhiêu mililít?', '5000 미니리터입니다.', 'Là 5000 ml ạ.']
];

sets.push({
  id: 'set_v2_04_tinh_quydoi',
  title: '4. Tính toán & Quy đổi đơn vị (36 câu)',
  description: '10 câu tính nhẩm cộng trừ nhân chia và 26 câu chuyển đổi đơn vị đo lường xưởng sản xuất',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: TINH_TOAN_36.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: item[0],
    qVi: item[1],
    aKr: item[2],
    aVi: item[3]
  }))
});

// ========================================================
// BỘ 5: HIỆU LỆNH & THAO TÁC THỂ CHẤT (31 CÂU)
// ========================================================
const HIEU_LENH_31 = [
  ['오른쪽으로 보세요', 'Hãy nhìn về bên phải', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['왼쪽으로 보세요', 'Hãy nhìn về bên trái', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['위로 보세요', 'Hãy nhìn lên trên', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['아래로 보세요', 'Hãy nhìn xuống dưới', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['오른손 올리세요. 내리세요', 'Hãy giơ tay phải lên. Hãy hạ xuống', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['왼손 올리세요. 내리세요', 'Hãy giơ tay trái lên. Hãy hạ xuống', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['양손 올리세요. 내리세요', 'Hãy giơ hai tay lên. Hãy hạ xuống', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['오른발 올리세요. 내리세요', 'Hãy giơ chân phải lên. Hạ xuống', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['왼발 올리세요. 내리세요', 'Hãy giơ chân trái lên. Hạ xuống', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['오른쪽으로 걸어가세요', 'Hãy bước sang bên phải', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['왼쪽으로 걸어가세요', 'Hãy bước sang bên trái', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['뒤로 걸어가세요', 'Hãy bước về đằng sau', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['앞으로 걸어가세요', 'Hãy tiến về phía trước', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['오른쪽으로 돌아서세요', 'Hãy quay về bên phải', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['왼쪽으로 돌아서세요', 'Hãy quay về bên trái', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['뒤로 돌아서세요', 'Hãy quay về đằng sau', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['앉으세요. 일어나세요', 'Hãy ngồi xuống. Hãy đứng lên', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['주먹을 쥐세요', 'Hãy nắm tay lại', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['주먹을 펴세요.', 'Hãy xòe tay ra', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['세번 박수 하세요.', 'Hãy vỗ tay ba lần', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['고개를 돌리세요.', 'Hãy quay cổ', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['허리를 돌리세요.', 'Hãy vặn mình', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['귀를 잡으세요.', 'Hãy sờ tai', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['왼쪽에 귀를 잡으세요.', 'Hãy sờ tai trái', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['오른 귀를 잡으세요.', 'Hãy sờ tai phải', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['코를 잡으세요.', 'Hãy sờ mũi', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['왼쪽 손으로 오른쪽 귀를 만져 보세요', 'Hãy dùng tay trái chạm vào tai phải.', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['오른쪽 손으로 왼쪽 귀를 만져 보세요', 'Hãy dùng tay phải chạm vào tai trái.', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['양팔을 앞으로 뻗어 보세요', 'Hãy giơ cả hai tay về phía trước', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['손가락을 펴 보세요', 'Hãy duỗi các ngón tay ra', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.'],
  ['손가락을 움직여 보세요', 'Hãy cử động các ngón tay', '네, 알겠습니다.', 'Vâng, tôi hiểu rồi.']
];

sets.push({
  id: 'set_v2_05_hieulenh',
  title: '5. Hiệu lệnh & Thao tác thể chất (31 câu)',
  description: '31 khẩu lệnh cử động tay chân, hướng nhìn, tư thế cơ thể giám khảo kiểm tra trực tiếp',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: HIEU_LENH_31.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: item[0],
    qVi: item[1],
    aKr: item[2],
    aVi: item[3]
  }))
});

// ========================================================
// BỘ 6: NHẬN DIỆN CÔNG CỤ SẢN XUẤT (67 CÔNG CỤ CÓ ẢNH)
// ========================================================
sets.push({
  id: 'set_v2_06_congcu_nhandien',
  title: '6. Nhận diện công cụ sản xuất (67 công cụ - có ảnh)',
  description: '67 công cụ sản xuất chế tạo kèm ảnh minh họa và tên gọi chuẩn tiếng Hàn',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: TOOL_NAMES.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: `이것은 무엇입니까? (${item.kr})`,
    qVi: `Cái này là gì? (${item.vi})`,
    aKr: `이것은 ${item.kr}입니다.`,
    aVi: `Đây là ${item.vi}.`,
    img: `/images/vong2/tool_${idx + 1}.png`
  }))
});

// ========================================================
// BỘ 7: THAO TÁC & HÀNH ĐỘNG SỬ DỤNG CÔNG CỤ (14 CÂU)
// ========================================================
const TOOL_ACTIONS = [
  ['망치를 가져와서 못을 박는 행동을 합니다.', 'Mang (cầm) búa đến rồi thực hiện việc đóng đinh.', '네, 망치로 못을 박겠습니다.', 'Vâng, tôi sẽ lấy búa để đóng đinh.'],
  ['렌치(스패너)를 가져와서 너트를 조이는 행동을 합니다.', 'Mang cờ lê đến để siết chặt đai ốc.', '네, 렌치로 너트를 조이겠습니다.', 'Vâng, tôi sẽ lấy cờ lê để siết chặt đai ốc.'],
  ['드라이버를 사용해서(가져와서) 나사를 조이는 행동을 합니다.', 'Dùng (mang) tua vít để xoáy ốc vít.', '네, 드라이버로 나사를 조이겠습니다.', 'Vâng, tôi sẽ dùng tua vít để xoáy vít.'],
  ['펜치를 사용해서(가져와서) 철사를 자르는 행동을 합니다.', 'Dùng (mang) kìm để cắt dây sắt.', '네, 펜치로 철사를 자르겠습니다.', 'Vâng, tôi sẽ dùng kìm để cắt dây sắt.'],
  ['충전(전동)드릴을 사용해서(가져와서) 나사를 푸는 행동을 합니다.', 'Dùng (mang) khoan pin (điện) để tháo vít.', '네, 드릴로 나사를 풀겠습니다.', 'Vâng, tôi sẽ dùng khoan để tháo vít.'],
  ['전기드릴을 사용해서(가져와서) 금속에 구멍을 뚫는 행동을 합니다.', 'Dùng (mang) khoan điện để khoan lỗ trên kim loại.', '네, 전기드릴로 구멍을 뚫겠습니다.', 'Vâng, tôi sẽ dùng khoan điện để khoan lỗ.'],
  ['육각렌치를 사용해서(가져와서) 육각 볼트를 조이는 행동을 합니다.', 'Dùng (mang) lục giác để vặn chặt bu lông đầu lục giác.', '네, 육각렌치로 조이겠습니다.', 'Vâng, tôi sẽ dùng cờ lê lục giác để siết bu lông.'],
  ['톱을 사용해서(가져와서) 나무판을 자르는 행동을 합니다.', 'Dùng (mang) cưa để thực hiện việc cắt gỗ.', '네, 톱으로 나무판을 자르겠습니다.', 'Vâng, tôi sẽ dùng cưa để cắt tấm gỗ.'],
  ['그라인더를 사용해서 금속 판을 가공하는 행동을 합니다.', 'Dùng máy mài để mài bề mặt tấm kim loại.', '네, 그라인더로 금속을 가공하겠습니다.', 'Vâng, tôi sẽ dùng máy mài để gia công kim loại.'],
  ['버니어캘리퍼스를 사용해서 볼트의 길이를 재는 행동을 합니다.', 'Dùng thước kẹp để đo chiều dài của bu lông.', '네, 버니어캘리퍼스로 길이를 재겠습니다.', 'Vâng, tôi sẽ dùng thước kẹp để đo chiều dài.'],
  ['줄을 사용해서 철판의 날카로운 모서리를 다듬는 행동을 합니다.', 'Dùng dũa để mài các cạnh sắc của tấm sắt.', '네, 줄로 날카로운 부분을 다듬겠습니다.', 'Vâng, tôi sẽ dùng dũa mài nhẵn phần cạnh sắc.'],
  ['테이프를 사용해서 상자를 포장하는 행동을 합니다.', 'Dùng băng dính để đóng gói hộp hàng.', '네, 테이프로 상자를 포장하겠습니다.', 'Vâng, tôi sẽ dùng băng dính đóng gói thùng hàng.'],
  ['사포를 사용해서 표면을 매끄럽게 만드는 행동을 합니다.', 'Dùng giấy nhám để làm nhẵn bề mặt.', '네, 사포로 표면을 매끄럽게 문지르겠습니다.', 'Vâng, tôi sẽ dùng giấy nhám đánh bóng bề mặt.'],
  ['망치로 못을 빼는 동작을 해 보세요.', 'Dùng búa để nhổ đinh.', '네, 망치로 못을 빼겠습니다.', 'Vâng, tôi sẽ dùng búa để nhổ đinh ra.']
];

sets.push({
  id: 'set_v2_07_congcu_thaotac',
  title: '7. Thao tác sử dụng công cụ (14 câu)',
  description: '14 câu khẩu lệnh và thao tác thực hành cầm nắm, vận hành dụng cụ trong xưởng',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: TOOL_ACTIONS.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: item[0],
    qVi: item[1],
    aKr: item[2],
    aVi: item[3]
  }))
});

// ========================================================
// BỘ 8: GIẢI THÍCH CÔNG DỤNG CÔNG CỤ (48 CÂU)
// ========================================================
const TOOL_EXPLAIN_48 = [
  ['이 도구는 무엇에 사용합니까? (CO2용접기)', 'Dụng cụ này được dùng để làm gì? (Máy hàn CO2)', '용접하는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để hàn kim loại.'],
  ['이건 언제 사용해요? (벤딩기)', 'Cái này dùng khi nào? (Máy đóng đai)', '끈을 고정하는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để đóng đai buộc dây cố định hàng.'],
  ['이건 뭐 하는 데 써요? (컨트롤 판넬)', 'Cái này dùng để làm gì? (Bảng điều khiển)', '기계를 제어하는 데 사용하는 도구입니다.', 'Là thiết bị dùng để điều khiển vận hành máy móc.'],
  ['이것은 뭐예요? (누전차단기)', 'Cái này là gì? (Cầu dao chống giật)', '전기를 차단하는 데 사용하는 도구입니다.', 'Là thiết bị dùng để ngắt điện khi xảy ra sự cố.'],
  ['이 도구는 무엇에 사용합니까? (에어콤프레샤)', 'Dụng cụ này được dùng để làm gì? (Máy nén khí)', '공기를 압축하는 데 사용하는 도구입니다.', 'Là thiết bị dùng để nén khí áp lực cao.'],
  ['이건 언제 사용해요? (호이스트)', 'Cái này dùng khi nào? (Tời pa lăng)', '물건을 들어올리는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để nâng kéo vật nặng lên cao.'],
  ['이건 뭐 하는 데 써요? (방청유)', 'Cái này dùng để làm gì? (Dầu bôi trơn)', '녹슬지 않게 하는 데 사용하는 도구입니다.', 'Là dầu dùng để bôi trơn và chống rỉ sét.'],
  ['이것은 뭐예요? (원형톱)', 'Cái này là gì? (Máy cưa đĩa)', '나무를 자르는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để cưa xẻ gỗ.'],
  ['이 도구는 무엇에 사용합니까? (회로시험기)', 'Dụng cụ này được dùng để làm gì? (Đồng hồ đo điện)', '전기를 측정하는 데 사용하는 도구입니다.', 'Là thiết bị dùng để đo thông số dòng điện, điện áp.'],
  ['이건 언제 사용해요? (버니어 캘리퍼스)', 'Cái này dùng khi nào? (Thước kẹp)', '두께를 재는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để đo độ dày, đường kính chính xác.'],
  ['이건 뭐 하는 데 써요? (지게차)', 'Cái này dùng để làm gì? (Xe nâng)', '화물을 운반하는 데 사용하는 도구입니다.', 'Là phương tiện dùng để nâng và vận chuyển hàng hóa.'],
  ['이것은 뭐예요? (대차)', 'Cái này là gì? (Xe đẩy bàn)', '물건을 옮기는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để di chuyển hàng hóa nhẹ.'],
  ['이 도구는 무엇에 사용합니까? (소켓 렌치)', 'Dụng cụ này được dùng để làm gì? (Cần siết bu lông)', '볼트를 조이는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để siết chặt bu lông.'],
  ['이건 언제 사용해요? (스패너)', 'Cái này dùng khi nào? (Cờ lê)', '너트를 조이는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để siết chặt đai ốc.'],
  ['이건 뭐 하는 데 써요? (작업등)', 'Cái này dùng để làm gì? (Đèn làm việc)', '작업할 때 비추는 데 사용하는 도구입니다.', 'Là đèn dùng để chiếu sáng khu vực thao tác.'],
  ['이것은 뭐예요? (파이프렌치)', 'Cái này là gì? (Kìm nước vặn ống)', '파이프를 조이는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để vặn siết đường ống.'],
  ['이 도구는 무엇에 사용합니까? (공구함)', 'Dụng cụ này được dùng để làm gì? (Hộp đồ nghề)', '공구를 보관하는 데 사용하는 도구입니다.', 'Là hộp dùng để cất giữ bảo quản dụng cụ.'],
  ['이건 언제 사용해요? (전기드릴)', 'Cái này dùng khi nào? (Máy khoan)', '구멍을 뚫는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để khoan tạo lỗ.'],
  ['이건 뭐 하는 데 써요? (핸드카)', 'Cái này dùng để làm gì? (Xe đẩy tay)', '물건을 나르는 데 사용하는 도구입니다.', 'Là xe dùng để chở và kéo hàng hóa.'],
  ['이것은 뭐예요? (육각렌치)', 'Cái này là gì? (Cờ lê lục giác)', '육각볼트를 조이는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để siết bu lông lục giác chìm.'],
  ['이 도구는 무엇에 사용합니까? (바구니)', 'Dụng cụ này được dùng để làm gì? (Giỏ đồ)', '물건을 담는 데 사용하는 도구입니다.', 'Là giỏ dùng để chứa đựng đồ đạc linh kiện.'],
  ['이건 언제 사용해요? (전선 릴)', 'Cái này dùng khi nào? (Cuộn cáp điện)', '전선을 감는 데 사용하는 도구입니다.', 'Là cuộn dùng để cuốn và kéo dài dây điện.'],
  ['이건 뭐 하는 데 써요? (핸드파래트)', 'Cái này dùng để làm gì? (Xe nâng pallet)', '짐을 나르는 데 사용하는 도구입니다.', 'Là xe kéo tay dùng để di chuyển các kiện hàng trên pallet.'],
  ['이것은 뭐예요? (마대)', 'Cái này là gì? (Bao tải)', '물건을 담는 데 사용하는 도구입니다.', 'Là bao bì dùng để chứa đựng nông sản, vật liệu.'],
  ['이 도구는 무엇에 사용합니까? (볼트/너트)', 'Dụng cụ này được dùng để làm gì? (Bu lông đai ốc)', '부품을 고정하는 데 사용하는 도구입니다.', 'Là chi tiết dùng để liên kết cố định các bộ phận.'],
  ['이건 언제 사용해요? (파렛트)', 'Cái này dùng khi nào? (Pallet)', '물건을 싣는 데 사용하는 도구입니다.', 'Là tấm kệ dùng để chất xếp hàng hóa lên trên.'],
  ['이건 뭐 하는 데 써요? (사다리)', 'Cái này dùng để làm gì? (Thang)', '높은 곳에 올라가는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để trèo lên vị trí cao.'],
  ['이것은 뭐예요? (스위치)', 'Cái này là gì? (Công tắc)', '전기를 켜는 데 사용하는 도구입니다.', 'Là thiết bị dùng để bật tắt nguồn điện máy móc.'],
  ['이 도구는 무엇에 사용합니까? (저울)', 'Dụng cụ này được dùng để làm gì? (Cái cân)', '무게를 재는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để đo trọng lượng hàng hóa.'],
  ['이건 언제 사용해요? (멀티탭)', 'Cái này dùng khi nào? (Ổ cắm nhiều lỗ)', '전원을 연결하는 데 사용하는 도구입니다.', 'Là thiết bị dùng để cắm nối nhiều nguồn điện.'],
  ['이건 뭐 하는 데 써요? (박스)', 'Cái này dùng để làm gì? (Thùng carton)', '물건을 포장하는 데 사용하는 도구입니다.', 'Là thùng giấy dùng để đóng gói bảo quản hàng.'],
  ['이것은 뭐예요? (망치)', 'Cái này là gì? (Cây búa)', '못을 박는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để đóng và nhổ đinh.'],
  ['이 도구는 무엇에 사용합니까? (환풍기)', 'Dụng cụ này được dùng để làm gì? (Quạt thông gió)', '공기를 순환시키는 데 사용하는 도구입니다.', 'Là thiết bị dùng để lưu thông và hút bụi làm sạch không khí.'],
  ['이건 언제 사용해요? (바이스)', 'Cái này dùng khi nào? (Ê tô)', '물건을 고정하는 데 사용하는 도구입니다.', 'Là dụng cụ kẹp dùng để giữ cố định phôi khi gia công.'],
  ['이건 뭐 하는 데 써요? (줄자)', 'Cái này dùng để làm gì? (Thước dây)', '길이를 재는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để đo kích thước chiều dài.'],
  ['이것은 뭐예요? (소화기)', 'Cái này là gì? (Bình chữa cháy)', '불을 끄는 데 사용하는 도구입니다.', 'Là dụng cụ chuyên dùng để dập tắt đám cháy.'],
  ['이 도구는 무엇에 사용합니까? (드럼통)', 'Dụng cụ này được dùng để làm gì? (Thùng phi)', '액체를 담는 데 사용하는 도구입니다.', 'Là thùng chứa dùng để đựng chất lỏng, dầu mỡ.'],
  ['이건 언제 사용해요? (비닐끈)', 'Cái này dùng khi nào? (Dây nilon)', '물건을 묶는 데 사용하는 도구입니다.', 'Là dây dùng để buộc chằng hàng hóa gọn gàng.'],
  ['이건 뭐 하는 데 써요? (공구 캐비넷)', 'Cái này dùng để làm gì? (Tủ đồ nghề)', '공구를 정리하는 데 사용하는 도구입니다.', 'Là tủ chuyên dụng dùng để sắp xếp ngăn nắp dụng cụ.'],
  ['이것은 뭐예요? (칼)', 'Cái này là gì? (Dao cắt)', '무언가를 자르는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để cắt gọt vật liệu.'],
  ['이 도구는 무엇에 사용합니까? (드라이버)', 'Dụng cụ này được dùng để làm gì? (Tua vít)', '나사를 조이는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để vặn siết xoáy ốc vít.'],
  ['이건 뭐 하는 데 써요? (톱)', 'Cái này dùng để làm gì? (Cưa tay)', '목재를 자르는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để cưa xẻ gỗ.'],
  ['이것은 뭐예요? (니퍼)', 'Cái này là gì? (Kìm cắt)', '선을 자르는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để cắt dây điện, dây cáp mỏng.'],
  ['이 도구는 무엇에 사용합니까? (손전등)', 'Dụng cụ này được dùng để làm gì? (Đèn pin)', '어두운 곳을 비추는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để chiếu sáng nơi tối.'],
  ['이건 뭐 하는 데 써요? (펜치)', 'Cái này dùng để làm gì? (Kìm đa năng)', '선을 자르는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để kẹp giữ và cắt dây kim loại.'],
  ['이것은 뭐예요? (테이프)', 'Cái này là gì? (Băng dính)', '포장하는 데 사용하는 도구입니다.', 'Là vật liệu dính dùng để dán niêm phong hộp hàng.'],
  ['이 도구는 무엇에 사용합니까? (삽)', 'Dụng cụ này được dùng để làm gì? (Cái xẻng)', '흙을 퍼는 데 사용하는 도구입니다.', 'Là dụng cụ dùng để xúc đất cát nguyên liệu.'],
  ['이건 언제 사용해요? (프라이어)', 'Cái này dùng khi nào? (Kìm mỏ quạ)', '물체를 잡는 데 사용하는 도구입니다.', 'Là dụng cụ kẹp dùng để giữ chặt vật thể gia công.']
];

sets.push({
  id: 'set_v2_08_congcu_congdung',
  title: '8. Giải thích công dụng công cụ (48 câu)',
  description: '48 câu hỏi đáp giải thích chi tiết mục đích sử dụng từng loại máy móc thiết bị xưởng',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: TOOL_EXPLAIN_48.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: item[0],
    qVi: item[1],
    aKr: item[2],
    aVi: item[3]
  }))
});

// ========================================================
// BỘ 9: BẢO QUẢN CÔNG CỤ (12 CÂU)
// ========================================================
const TOOL_STORAGE_12 = [
  ['버니어 캘리퍼스를 (공구함)바구니에 넣으세요.', 'Hãy đặt thước kẹp vernier vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.'],
  ['스패너를 (공구함)바구니에 넣으세요.', 'Hãy đặt cờ lê vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.'],
  ['작업등을 (공구함)바구니에 넣으세요.', 'Hãy đặt đèn làm việc vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.'],
  ['나사못을 (공구함)바구니에 넣으세요.', 'Hãy đặt ốc vít vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.'],
  ['망치를 (공구함)바구니에 넣으세요.', 'Hãy đặt búa vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.'],
  ['줄자를 (공구함)바구니에 넣으세요.', 'Hãy đặt thước dây vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.'],
  ['드라이버를 (공구함)바구니에 넣으세요.', 'Hãy đặt tuốc nơ vít vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.'],
  ['펜치를 (공구함)바구니에 넣으세요.', 'Hãy đặt kìm vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.'],
  ['니퍼를 (공구함)바구니에 넣으세요.', 'Hãy đặt kìm cắt vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.'],
  ['테이프를 (공구함)바구니에 넣으세요.', 'Hãy đặt băng keo vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.'],
  ['줄을 (공구함)바구니에 넣으세요.', 'Hãy đặt giũa vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.'],
  ['경첩을 (공구함)바구니에 넣으세요.', 'Hãy đặt bản lề vào giỏ (hộp công cụ).', '네, 바구니에 넣겠습니다.', 'Vâng, tôi sẽ cất vào giỏ.']
];

sets.push({
  id: 'set_v2_09_congcu_baoquan',
  title: '9. Bảo quản & Cất giữ công cụ (12 câu)',
  description: '12 khẩu lệnh yêu cầu thí sinh phân loại và cất đồ nghề gọn gàng vào hộp dụng cụ',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: TOOL_STORAGE_12.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: item[0],
    qVi: item[1],
    aKr: item[2],
    aVi: item[3]
  }))
});

// ========================================================
// BỘ 10: THIẾT BỊ & ĐỒ BẢO HỘ AN TOÀN (15 ĐỒ BẢO HỘ CÓ ẢNH)
// ========================================================
sets.push({
  id: 'set_v2_10_thietbi_an_toan',
  title: '10. Thiết bị & Đồ bảo hộ an toàn (15 đồ - có ảnh)',
  description: '15 trang bị bảo hộ lao động cá nhân kèm ảnh thực tế và tên gọi chuẩn',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: SAFETY_EQUIPMENT.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: `이것은 무엇입니까? (${item.kr})`,
    qVi: `Đây là trang bị gì? (${item.vi})`,
    aKr: `이것은 ${item.kr}입니다.`,
    aVi: `Đây là ${item.vi}.`,
    img: `/images/vong2/safety_${idx + 1}.png`
  }))
});

// ========================================================
// BỘ 11: BIỂN BÁO AN TOÀN LAO ĐỘNG (95 BIỂN BÁO CÓ ẢNH)
// ========================================================
sets.push({
  id: 'set_v2_11_bienbao_an_toan',
  title: '11. Hệ thống biển báo an toàn (95 biển - có ảnh)',
  description: 'Trọn bộ 95 biển báo chỉ thị, cảnh báo nguy hiểm, biển cấm, thoát hiểm khẩn cấp và PCCC',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: SAFETY_SIGNS.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: `이 표지는 무슨 뜻입니까? (${item.kr})`,
    qVi: `Biển báo này có ý nghĩa gì? (${item.vi})`,
    aKr: `이 표지는 '${item.kr}'라는 뜻입니다.`,
    aVi: `Biển báo này có nghĩa là '${item.vi}'.`,
    img: `/images/vong2/sign_${idx + 1}.png`
  }))
});

// ========================================================
// BỘ 12: AN TOÀN LAO ĐỘNG - TRƯỚC KHI LÀM VIỆC (37 CÂU)
// ========================================================
const ANTOAN_TRUOC_37 = [
  ['보호구가 무엇인가요?', 'Dụng cụ bảo hộ là gì?', '보호구는 작업자의 몸을 위험에서 보호하는 장비입니다.', 'Dụng cụ bảo hộ là dụng cụ bảo vệ cơ thể người lao động khỏi nguy hiểm.'],
  ['보호구에는 어떤 종류가 있나요?', 'Có những loại dụng cụ bảo hộ nào?', '보호구에는 안전모, 안전화, 안전대, 보안면, 귀마개, 마스크 등이 있습니다.', 'Dụng cụ bảo hộ gồm mũ, giày, dây an toàn, mặt nạ, nút tai và khẩu trang bảo hộ.'],
  ['안전모는 무엇입니까?', 'Mũ bảo hộ là gì?', '안전모는 머리를 보호하는 보호구입니다.', 'Mũ bảo hộ là dụng cụ bảo vệ đầu.'],
  ['안전화는 무엇입니까?', 'Giày bảo hộ là gì?', '안전화는 떨어지는 물건이나 날카로운 물건으로부터 발을 보호하는 신발입니다.', 'Giày bảo hộ là giày bảo vệ chân khỏi vật rơi hoặc vật sắc nhọn.'],
  ['안전대는 무엇입니까?', 'Dây an toàn là gì?', '안전대는 높은 곳에서 떨어지는 것을 막는 보호구입니다.', 'Dây an toàn là dụng cụ giúp ngăn rơi ngã khi làm việc trên cao.'],
  ['보안면은 무엇입니까?', 'Mặt nạ bảo hộ là gì?', '보안면은 얼굴과 눈을 보호하는 보호구입니다.', 'Mặt nạ bảo hộ là dụng cụ bảo vệ mặt và mắt.'],
  ['귀마개는 무엇입니까?', 'Nút tai là gì?', '귀마개는 큰 소음으로부터 귀를 보호하는 보호구입니다.', 'Nút tai là dụng cụ bảo vệ tai khỏi tiếng ồn lớn.'],
  ['방진마스크는 무엇입니까?', 'Khẩu trang chống bụi là gì?', '방진마스크는 먼지로부터 입과 코를 보호하는 마스크입니다.', 'Khẩu trang chống bụi là khẩu trang bảo vệ miệng và mũi khỏi bụi.'],
  ['방독마스크는 무엇입니까?', 'Khẩu trang chống độc là gì?', '방독마스크는 유해 화학물질로부터 입과 코를 보호하는 마스크입니다.', 'Khẩu trang chống độc là khẩu trang bảo vệ miệng và mũi khỏi hóa chất độc hại.'],
  ['방열복은 무엇입니까?', 'Quần áo chống nhiệt là gì?', '방열복은 높은 열과 불로부터 몸을 보호하는 작업복입니다.', 'Quần áo chống nhiệt là đồ bảo hộ bảo vệ cơ thể khỏi nhiệt cao và lửa.'],
  ['방한복은 무엇입니까?', 'Quần áo chống lạnh là gì?', '방한복은 추운 곳에서 몸을 따뜻하게 보호하는 작업복입니다.', 'Quần áo chống lạnh là đồ bảo hộ giữ ấm cơ thể khi làm việc nơi lạnh.'],
  ['보호구를 왜 착용하여야 할까요?', 'Tại sao chúng ta phải đeo dụng cụ bảo hộ?', '보호구는 생명과 건강을 지키기 위해 반드시 착용해야 합니다.', 'Cần đeo dụng cụ bảo hộ để bảo vệ tính mạng và sức khỏe.'],
  ['머리를 보호하기 위해 착용하는 보호구는 무엇인가요?', 'Dụng cụ bảo hộ để bảo vệ đầu là gì?', '머리를 보호하는 보호구는 안전모입니다.', 'Dụng cụ bảo vệ đầu là mũ bảo hộ.'],
  ['높은 장소에서 작업 시 안전모 외에 착용해야 하는 보호구는 무엇인가요?', 'Dụng cụ bảo hộ nào cần phải đeo khi làm việc ở nơi cao ngoài mũ bảo hộ?', '높은 곳에서는 안전모와 함께 안전대를 착용해야 합니다.', 'Khi làm việc trên cao cần đội mũ bảo hộ và đeo dây an toàn.'],
  ['화학물질로부터 입과 코를 보호하기 위해 착용하는 보호구는 무엇인가요?', 'Dụng cụ bảo hộ nào được đeo để bảo vệ miệng và mũi khỏi các chất hóa học?', '화학물질로부터 입과 코를 보호하는 보호구는 방독마스크입니다.', 'Dụng cụ bảo vệ miệng và mũi khỏi hóa chất là khẩu trang chống độc.'],
  ['소음이 심한 작업 환경에서 귀를 보호하기 위해 착용하는 보호구는 무엇인가요?', 'Dụng cụ bảo hộ nào được đeo để bảo vệ tai khỏi tiếng ồn trong môi trường làm việc có tiếng ồn lớn?', '소음이 심한 곳에서 귀를 보호하는 보호구는 귀마개입니다.', 'Dụng cụ bảo vệ tai ở nơi ồn là nút tai.'],
  ['비상구가 무엇인가요?', 'Cửa thoát hiểm là gì?', '비상구는 사고가 났을 때 빨리 대피하는 출입구입니다.', 'Cửa thoát hiểm là lối ra để sơ tán nhanh khi có sự cố.'],
  ['소화기가 무엇인가요?', 'Bình chữa cháy là gì?', '소화기는 불이 났을 때 불을 끄는 장비입니다.', 'Bình chữa cháy là thiết bị dùng để dập lửa khi có cháy.'],
  ['대피로는 무엇인가요?', 'Lối thoát hiểm là gì?', '대피로는 위급할 때 안전하게 나가는 길입니다.', 'Lối thoát hiểm là đường đi an toàn khi có tình huống khẩn cấp.'],
  ['소화기란 무엇이며 소화기의 색상은 어떻게 되나요?', 'Bình chữa cháy là gì và màu sắc của bình chữa cháy như thế nào?', '소화기는 불을 끄는 장비이며 보통 빨간색입니다.', 'Bình chữa cháy là thiết bị dập lửa và thường có màu đỏ.'],
  ['비상구 등 대피로는 왜 확인해야 할까요?', 'Tại sao cần phải kiểm tra lối thoát hiểm?', '비상구와 대피로를 알아야 사고 때 빨리 대피할 수 있기 때문입니다.', 'Cần biết cửa và lối thoát hiểm để sơ tán nhanh khi có sự cố.'],
  ['안전보건표지는 무엇인가요?', 'Biển báo an toàn là gì?', '안전보건표지는 위험을 알리고 안전 행동을 안내하는 표지입니다.', 'Biển an toàn vệ sinh lao động là biển báo nguy hiểm và hướng dẫn hành động an toàn.'],
  ['안전보건표지에는 어떤 종류가 있을까요?', 'Có những loại biển báo an toàn nào?', '안전보건표지에는 경고, 금지, 지시, 안내 표지가 있습니다.', 'Biển an toàn gồm biển cảnh báo, biển cấm, biển chỉ dẫn và biển hướng dẫn.'],
  ['안전보건표지를 왜 확인해야 할까요?', 'Tại sao cần phải kiểm tra biển báo an toàn?', '안전보건표지를 확인하면 위험을 빠르게 알 수 있기 때문입니다.', 'Cần xem biển an toàn để nhận biết nguy hiểm nhanh chóng.'],
  ['위험장소 출입금지 등 금지표지는 무슨 색인가요?', 'Biển cấm như cấm vào khu vực nguy hiểm có màu gì?', '금지표지는 빨간색 원과 사선으로 표시합니다.', 'Biển cấm được ký hiệu bằng vòng tròn đỏ và đường chéo đỏ.'],
  ['방호장치가 무엇인가요?', 'Thiết bị bảo vệ là gì?', '방호장치는 기계의 위험으로부터 작업자를 보호하는 장치입니다.', 'Thiết bị bảo vệ là thiết bị bảo vệ người lao động khỏi nguy hiểm từ máy móc.'],
  ['정상 작동이 무슨 뜻인가요?', 'Hoạt động bình thường có nghĩa là gì?', '정상 작동은 장치가 안전하고 정확하게 작동하는 상태입니다.', 'Hoạt động bình thường là trạng thái thiết bị chạy an toàn và chính xác.'],
  ['방호장치 정상 작동 여부를 왜 확인하여야 하나요?', 'Tại sao cần phải kiểm tra xem thiết bị bảo vệ có hoạt động bình thường không?', '방호장치가 정상 작동해야 사고를 막을 수 있기 때문입니다.', 'Cần kiểm tra vì thiết bị bảo vệ phải hoạt động tốt mới ngăn được tai nạn.'],
  ['작업 전 안전점검이 무엇인가요?', 'Kiểm tra an toàn trước khi làm việc là gì?', '작업 전 안전점검은 작업 전에 기계와 설비의 이상 여부를 확인하는 것입니다.', 'Kiểm tra an toàn trước khi làm việc là kiểm tra máy móc, thiết bị có bất thường không.'],
  ['화학물질이 무엇인가요?', 'Hóa chất là gì?', '화학물질은 사람에게 해롭거나 폭발 위험이 있는 고체, 액체, 기체입니다.', 'Hóa chất là chất rắn, lỏng hoặc khí có thể gây hại hoặc có nguy cơ cháy nổ.'],
  ['MSDS(물질안전보건자료)가 무엇인가요?', 'MSDS (dữ liệu an toàn và sức khỏe hóa chất) là gì?', 'MSDS는 화학물질의 위험성과 취급 방법을 알려 주는 자료입니다.', 'MSDS là tài liệu cho biết nguy hiểm và cách xử lý hóa chất.'],
  ['화학물질을 취급할 때 어떤 보호구가 필요한가요?', 'Khi xử lý hóa chất, cần sử dụng thiết bị bảo hộ nào?', '화학물질을 취급할 때는 장갑, 보호안경, 보호복 등을 착용해야 합니다.', 'Khi xử lý hóa chất cần đeo găng tay, kính bảo hộ và mặc đồ bảo hộ.'],
  ['화학물질 MSDS(물질안전보건자료)를 왜 확인해야 할까요?', 'Tại sao cần phải kiểm tra MSDS - dữ liệu an toàn và sức khỏe hóa chất?', 'MSDS를 확인해야 화학물질을 안전하게 취급할 수 있기 때문입니다.', 'Cần xem MSDS để sử dụng hóa chất an toàn.'],
  ['화학물질을 사용하는 작업 전에는 어떤 보호구를 준비해야 하나요?', 'Trước khi sử dụng hóa chất, cần chuẩn bị thiết bị bảo hộ nào?', '작업 전에는 방독마스크와 화학물질용 보호장갑을 준비해야 합니다.', 'Trước khi làm việc cần chuẩn bị khẩu trang chống độc và găng tay chống hóa chất.'],
  ['밀폐공간이 무엇인가요?', 'Không gian kín là gì?', '밀폐공간은 환기가 잘 안 되어 산소 부족이나 유해가스 위험이 있는 공간입니다.', 'Không gian kín là nơi thông gió kém, có nguy cơ thiếu oxy hoặc khí độc.'],
  ['환기가 무슨 뜻인가요?', 'Thông gió có nghĩa là gì?', '환기는 오염된 공기를 깨끗한 공기로 바꾸는 것입니다.', 'Thông gió là thay không khí bẩn bằng không khí sạch.'],
  ['밀폐공간 작업 전 왜 환기를 해야 할까요?', 'Tại sao cần phải thông gió trước khi làm việc trong không gian kín?', '환기하지 않으면 산소 부족이나 유해가스로 사망할 수 있기 때문입니다.', 'Cần thông gió vì thiếu oxy hoặc khí độc có thể gây tử vong.']
];

sets.push({
  id: 'set_v2_12_antoan_truoc_khi_lam',
  title: '12. An toàn lao động - Trước khi làm việc (37 câu)',
  description: '37 câu hỏi đáp chuẩn bị bảo hộ lao động, lối thoát hiểm, biển báo, thiết bị bảo vệ máy, MSDS và không gian kín',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: ANTOAN_TRUOC_37.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: item[0],
    qVi: item[1],
    aKr: item[2],
    aVi: item[3]
  }))
});

// ========================================================
// BỘ 13: AN TOÀN LAO ĐỘNG - TRONG KHI LÀM VIỆC (54 CÂU)
// ========================================================
const ANTOAN_TRONG_54 = [
  ['가동이 무슨 뜻인가요?', 'Vận hành có nghĩa là gì?', '가동은 기계나 설비를 실제로 작동시키는 것입니다.', 'Vận hành là cho máy móc hoặc thiết bị hoạt động.'],
  ['정비가 무슨 뜻인가요?', 'Bảo trì có nghĩa là gì?', '정비는 기계를 점검하고 수리하거나 부품을 교체하는 작업입니다.', 'Bảo trì là kiểm tra, sửa chữa máy hoặc thay linh kiện.'],
  ['가동 중인 기계를 왜 정비하면 안 될까요?', 'Tại sao không được bảo trì máy móc đang hoạt động?', '가동 중인 기계를 정비하면 갑자기 움직여 사고가 날 수 있기 때문입니다.', 'Không được bảo trì máy đang chạy vì máy có thể bất ngờ chuyển động gây tai nạn.'],
  ['기계가 알 수 없는 이유로 멈추면 어떻게 해야 하나요?', 'Nếu máy móc dừng lại vì lý do không rõ, bạn nên làm gì?', '함부로 조작하지 말고 관리자에게 보고해야 합니다.', 'Không tự ý thao tác, cần báo cho quản lý.'],
  ['모르는 기계가 무슨 뜻인가요?', 'Máy móc lạ có nghĩa là gì?', '모르는 기계는 사용법을 정확히 모르는 설비입니다.', 'Máy không biết là thiết bị chưa nắm rõ cách sử dụng.'],
  ['임의 조작이 무슨 뜻인가요?', 'Thao tác tùy tiện có nghĩa là gì?', '임의 조작은 허가 없이 기계나 설비를 마음대로 조작하는 것입니다.', 'Thao tác tùy tiện là tự ý điều khiển máy móc khi chưa được phép.'],
  ['모르는 기계를 왜 임의로 조작하면 안 될까요?', 'Tại sao không được thao tác tùy tiện với máy móc lạ?', '모르는 기계를 임의로 조작하면 예상 못한 사고가 날 수 있기 때문입니다.', 'Không tự ý dùng máy không biết vì có thể gây tai nạn bất ngờ.'],
  ['비상정지장치가 무엇인지 아나요?', 'Bạn có biết thiết bị dừng khẩn cấp là gì không?', '비상정지장치는 위험할 때 기계를 즉시 멈추는 버튼입니다.', 'Thiết bị dừng khẩn cấp là nút dùng để dừng máy ngay khi nguy hiểm.'],
  ['안전장치·시설이 무엇인지 알고 있나요?', 'Bạn có biết thiết bị và cơ sở an toàn là gì không?', '안전장치·시설은 작업자를 사고로부터 보호하는 설비입니다.', 'Thiết bị/cơ sở an toàn là thiết bị bảo vệ người lao động khỏi tai nạn.'],
  ['해체·해지가 무슨 뜻인지 알고 있나요?', 'Bạn có biết tháo dỡ hoặc vô hiệu hóa có nghĩa là gì không?', '해체·해지는 장치를 분리하거나 안전기능을 멈추는 것입니다.', 'Tháo dỡ/vô hiệu hóa là tháo thiết bị hoặc làm ngừng chức năng an toàn.'],
  ['안전장치·시설을 왜 해체·해지하면 안될까요?', 'Tại sao không được tháo dỡ hoặc vô hiệu hóa thiết bị và cơ sở an toàn?', '안전장치를 해체하면 사고를 막을 수 없기 때문입니다.', 'Không được tháo thiết bị an toàn vì sẽ không còn ngăn được tai nạn.'],
  ['기계의 안전장치를 해체하고 작업하면 어떤 위험이 있나요?', 'Nếu tháo dỡ thiết bị an toàn của máy móc và làm việc, có những nguy hiểm nào?', '안전장치를 해체하고 작업하면 기계에 끼일 위험이 있습니다.', 'Nếu tháo thiết bị an toàn khi làm việc, có nguy cơ bị kẹt vào máy.'],
  ['지정이 무슨 뜻인지 알고 있나요?', 'Bạn có biết quy định có nghĩa là gì không?', '지정은 사고 예방을 위해 사람, 물건, 장소를 정해 두는 것입니다.', 'Chỉ định là quy định người, vật hoặc địa điểm để phòng tai nạn.'],
  ['보조 도구·공구가 무엇인가요?', 'Công cụ phụ trợ là gì?', '보조 도구·공구는 작업을 더 안전하게 돕는 도구입니다.', 'Dụng cụ phụ trợ là dụng cụ giúp làm việc an toàn hơn.'],
  ['작업 시 왜 지정된 보조 도구·공구를 사용해야 할까요?', 'Khi làm việc, tại sao phải sử dụng công cụ phụ trợ đã được chỉ định?', '지정된 도구를 써야 파손과 사고를 막을 수 있기 때문입니다.', 'Cần dùng đúng dụng cụ đã quy định để tránh hư hỏng và tai nạn.'],
  ['기계 작업 시 보조 도구를 사용하는 이유를 알고 있나요?', 'Bạn có biết lý do tại sao phải sử dụng công cụ phụ trợ khi làm việc với máy móc không?', '기계 작업 시 손 끼임 사고를 막기 위해 보조 도구를 사용합니다.', 'Khi làm việc với máy cần dùng dụng cụ phụ trợ để tránh kẹt tay.'],
  ['지게차가 무엇인가요?', 'Xe nâng là gì?', '지게차는 무거운 화물이나 자재를 들어 운반하는 기계입니다.', 'Xe nâng là máy dùng để nâng và vận chuyển hàng hoặc vật liệu.'],
  ['안전벨트가 무엇인가요?', 'Dây an toàn là gì?', '안전벨트는 운전자가 튕겨 나가는 것을 막는 보호장비입니다.', 'Dây an toàn là thiết bị giúp người lái không bị văng ra ngoài.'],
  ['시야 확보는 무슨 뜻일까요?', 'Đảm bảo tầm nhìn có nghĩa là gì?', '시야 확보는 앞, 옆, 뒤를 잘 확인하며 운전하는 것입니다.', 'Đảm bảo tầm nhìn là quan sát rõ phía trước, hai bên và phía sau khi lái.'],
  ['지게차 운전 시 왜 안전벨트를 착용하고 시야를 확보 해야 할까요?', 'Tại sao khi lái xe nâng cần đeo dây an toàn và đảm bảo tầm nhìn?', '안전벨트와 시야 확보는 운전자와 동료의 사고를 막기 때문입니다.', 'Dây an toàn và tầm nhìn tốt giúp phòng tai nạn cho người lái và đồng nghiệp.'],
  ['지게차를 운전할 수 있나요? 지게차는 누가 운전할 수 있나요?', 'Bạn có thể lái xe nâng không? Ai có thể lái xe nâng?', '지게차는 자격이 있는 사람만 운전할 수 있습니다.', 'Chỉ người có đủ điều kiện mới được lái xe nâng.'],
  ['위험작업이 무엇인가요?', 'Công việc nguy hiểm là gì?', '위험작업은 사고나 부상 위험이 높은 작업입니다.', 'Công việc nguy hiểm là công việc có nguy cơ tai nạn hoặc chấn thương cao.'],
  ['2인1조 작업이 무엇인가요?', 'Công việc theo nhóm 2 người là gì?', '2인1조 작업은 두 사람이 함께 하며 한 사람이 서로를 확인하는 작업입니다.', 'Làm việc theo nhóm 2 người là hai người cùng làm và hỗ trợ, giám sát nhau.'],
  ['위험작업은 왜 2인1조로 해야 할까요?', 'Tại sao công việc nguy hiểm phải được thực hiện theo nhóm 2 người?', '2인1조로 하면 사고 때 바로 구조하고 대응할 수 있기 때문입니다.', 'Cần làm 2 người để có thể cứu hộ và xử lý ngay khi có sự cố.'],
  ['사다리 위에서 혼자 작업할 수 있나요?', 'Bạn có thể làm việc một mình trên thang không?', '사다리 작업은 혼자 하지 말고 아래에서 한 사람이 잡아줘야 합니다.', 'Không nên làm việc trên thang một mình, cần có người giữ thang bên dưới.'],
  ['중장비가 무엇인가요?', 'Thiết bị nặng là gì?', '중장비는 큰 작업을 하는 크고 무거운 기계장비입니다.', 'Thiết bị nặng là máy móc lớn, nặng dùng cho công việc lớn.'],
  ['작업구역이 무엇인가요?', 'Khu vực làm việc là gì?', '작업구역은 작업자가 일하거나 장비가 움직이는 위험 구역입니다.', 'Khu vực làm việc là nơi người lao động làm việc hoặc máy móc hoạt động, có nguy cơ tai nạn.'],
  ['중장비 작업구역은 왜 접근 금지 할까요?', 'Tại sao khu vực làm việc của thiết bị nặng lại bị cấm tiếp cận?', '중장비 주변은 사각지대가 많아 접근하면 매우 위험하기 때문입니다.', 'Không được lại gần thiết bị nặng vì có nhiều điểm mù rất nguy hiểm.'],
  ['근처에서 중장비가 작업을 하고 있으면 어떻게 해야 하나요?', 'Nếu có thiết bị nặng đang làm việc gần đó, bạn nên làm gì?', '중장비 작업구역에는 접근하지 말아야 합니다.', 'Không được vào khu vực làm việc của thiết bị nặng.'],
  ['화재가 무엇인지 알고 있나요?', 'Bạn có biết hỏa hoạn là gì không?', '화재는 물질이 불에 타며 열과 빛을 내는 현상입니다.', 'Cháy là hiện tượng vật liệu bắt lửa và tạo ra nhiệt, ánh sáng.'],
  ['화기가 무엇인지 알고 있나요?', 'Bạn có biết nguồn lửa là gì không?', '화기는 불꽃, 불티, 열을 낼 수 있는 기구나 장치입니다.', 'Nguồn lửa là dụng cụ hoặc thiết bị có thể tạo lửa, tia lửa hoặc nhiệt.'],
  ['화재 가능 물질 주변에서 왜 화기를 금지할까요?', 'Tại sao lại cấm sử dụng lửa gần các vật liệu có khả năng cháy?', '가연성 물질 주변에서 화기를 쓰면 화재 위험이 크기 때문입니다.', 'Không dùng nguồn lửa gần vật dễ cháy vì nguy cơ cháy rất cao.'],
  ['불에 잘 타는 물건이 근처에 있으면 용접작업 전에 어떻게 해야 하나요?', 'Nếu có vật dễ cháy gần đó, bạn nên làm gì trước khi thực hiện công việc hàn?', '용접 전에는 불에 잘 타는 물건을 치워야 합니다.', 'Trước khi hàn cần dọn các vật dễ cháy ra xa.'],
  ['불이 났을 때는 어떻게 해야 하나요?', 'Bạn nên làm gì khi có hỏa hoạn xảy ra?', '불이 나면 소화기로 끄고, 끌 수 없으면 즉시 대피해야 합니다.', 'Khi có cháy, dùng bình chữa cháy; nếu không dập được thì sơ tán ngay.'],
  ['화학물질이 무엇인가요?', 'Hóa chất là gì?', '화학물질은 사람에게 해롭거나 폭발 위험이 있는 물질입니다.', 'Hóa chất là chất có thể gây hại cho người hoặc có nguy cơ cháy nổ.'],
  ['환기장치가 무엇인가요?', 'Hệ thống thông gió là gì?', '환기장치는 유해 공기를 빼고 신선한 공기를 넣는 설비입니다.', 'Hệ thống thông gió là thiết bị hút khí độc ra và đưa không khí sạch vào.'],
  ['화학물질 취급 시 왜 환기장치를 가동해야 할까요?', 'Tại sao khi xử lý hóa chất phải vận hành hệ thống thông gió?', '화학물질의 유해가스를 밖으로 배출해야 건강을 지킬 수 있기 때문입니다.', 'Cần chạy thông gió để đưa khí độc chất ra ngoài và bảo vệ sức khỏe.'],
  ['화학물질을 다룰 때는 어떻게 해야 하나요?', 'Khi xử lý hóa chất, bạn nên làm gì?', '화학물질을 다룰 때는 환기하고 적절한 보호구를 착용해야 합니다.', 'Khi xử lý hóa chất cần thông gió và đeo thiết bị bảo hộ phù hợp.'],
  ['통제구역이 무엇인가요?', 'Khu vực kiểm soát là gì?', '통제구역은 위험해서 허가 없이 들어갈 수 없는 구역입니다.', 'Khu vực kiểm soát là khu vực nguy hiểm, không được vào nếu chưa được phép.'],
  ['허가가 무슨 뜻인가요?', 'Giấy phép có nghĩa là gì?', '허가는 안전 조건을 확인한 뒤 작업을 승인하는 것입니다.', 'Giấy phép là việc kiểm tra điều kiện an toàn rồi cho phép làm việc.'],
  ['통제구역은 왜 허가 없이 출입 금지 할까요?', 'Tại sao khu vực kiểm soát lại bị cấm vào khi không có giấy phép?', '통제구역은 사고 위험이 높아 허가 없이 들어가면 위험하기 때문입니다.', 'Không vào khu vực kiểm soát khi chưa được phép vì nguy cơ tai nạn cao.'],
  ['출입 금지라는 뜻을 알고 있나요?', 'Bạn có biết nghĩa của "cấm vào" không?', '출입 금지는 위험해서 들어가면 안 된다는 뜻입니다.', 'Cấm vào nghĩa là nơi nguy hiểm, không được đi vào.'],
  ['중량물이 무엇인지 알고 있나요?', 'Bạn có biết vật nặng là gì không?', '중량물은 사람이 쉽게 들거나 옮기기 어려운 무거운 물건입니다.', 'Vật nặng là vật khó nâng hoặc di chuyển bằng sức người.'],
  ['중량물 들기는 왜 허리 펴고 다리 힘을 이용해야 할까요?', 'Tại sao khi nâng vật nặng phải giữ lưng thẳng và sử dụng sức mạnh của chân?', '허리 펴고 다리 힘으로 들어야 허리를 다치지 않기 때문입니다.', 'Giữ lưng thẳng và dùng sức chân để nâng để tránh bị đau lưng.'],
  ['무거운 물건은 어떻게 들어야 하나요?', 'Bạn nên nâng vật nặng như thế nào?', '무거운 물건은 두 사람 이상이 들거나 장비를 사용해야 합니다.', 'Vật nặng nên được nâng bởi hai người trở lên hoặc dùng thiết bị hỗ trợ.'],
  ['운반이 무엇인가요?', 'Vận chuyển là gì?', '운반은 물건을 한 장소에서 다른 장소로 옮기는 것입니다.', 'Vận chuyển là đưa đồ vật từ nơi này sang nơi khác.'],
  ['운반 기구가 무엇인가요?', 'Thiết bị vận chuyển là gì?', '운반 기구는 물건을 안전하고 쉽게 옮기는 도구입니다.', 'Dụng cụ vận chuyển là công cụ giúp di chuyển đồ vật an toàn và dễ hơn.'],
  ['중량물 운반 시 왜 운반기구를 활용해야 할까요?', 'Tại sao khi vận chuyển vật nặng phải sử dụng thiết bị vận chuyển?', '운반기구를 사용하면 허리 부상 위험을 줄일 수 있기 때문입니다.', 'Cần dùng dụng cụ vận chuyển để giảm nguy cơ chấn thương lưng.'],
  ['무거운 물건을 옮길 때에는 어떻게 해야 하나요?', 'Khi di chuyển vật nặng, bạn nên làm gì?', '무거운 물건을 옮길 때는 운반기구를 사용해야 합니다.', 'Khi di chuyển vật nặng cần dùng dụng cụ vận chuyển.'],
  ['이동이 무엇인가요?', 'Di chuyển là gì?', '이동은 한 장소에서 다른 장소로 옮겨 가는 것입니다.', 'Di chuyển là đi từ nơi này sang nơi khác.'],
  ['안전통로가 무엇인가요?', 'Lối đi an toàn là gì?', '안전통로는 작업자가 안전하게 다니는 통로입니다.', 'Lối đi an toàn là lối để người lao động đi lại an toàn.'],
  ['이동 시 왜 안전통로를 이용해야 할까요?', 'Tại sao khi di chuyển phải sử dụng lối đi an toàn?', '안전통로를 이용해야 장애물과 기계 위험을 피할 수 있기 때문입니다.', 'Cần đi lối an toàn để tránh chướng ngại vật và nguy hiểm từ máy móc.'],
  ['작업 중이란 무슨 뜻인가요?', 'Bạn có biết "đang làm việc" có nghĩa là gì không?', '작업 중이란 작업자가 업무와 관련된 모든 행위를 수행하는 시간이나 상태입니다.', 'Đang làm việc là trạng thái và thời gian mà người lao động thực hiện các động tác liên quan đến công việc.'],
  ['작업 중 왜 휴대폰을 사용하면 안 될까요?', 'Tại sao khi đang làm việc lại không được sử dụng điện thoại di động?', '작업 중 휴대폰을 쓰면 집중력이 떨어져 사고 위험이 높아지기 때문입니다.', 'Không dùng điện thoại khi làm việc vì mất tập trung dẫn đến nguy cơ tai nạn cao.']
];

sets.push({
  id: 'set_v2_13_antoan_trong_khi_lam',
  title: '13. An toàn lao động - Trong khi làm việc (54 câu)',
  description: '54 câu hỏi đáp quy tắc an toàn máy móc, xe nâng, làm việc nhóm, nâng hạ vật nặng và cấm dùng điện thoại',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: ANTOAN_TRONG_54.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: item[0],
    qVi: item[1],
    aKr: item[2],
    aVi: item[3]
  }))
});

// ========================================================
// BỘ 14: AN TOÀN LAO ĐỘNG - SAU KHI LÀM VIỆC & SỰ CỐ (34 CÂU)
// ========================================================
const ANTOAN_SAU_34 = [
  // Sau khi làm việc (17 câu)
  ['정리정돈이 무슨 뜻인가요?', 'Bạn có biết "sắp xếp" có nghĩa là gì không?', '정리정돈은 물건을 제자리에 두고 주변을 깨끗하게 하는 것입니다.', 'Sắp xếp gọn gàng là để đồ đúng chỗ và giữ nơi làm việc sạch sẽ.'],
  ['청소가 무슨 뜻인가요?', 'Bạn có biết "dọn dẹp" có nghĩa là gì không?', '청소는 먼지, 쓰레기, 기름 등을 치우는 것입니다.', 'Dọn dẹp là loại bỏ bụi, rác, dầu mỡ và chất bẩn.'],
  ['작업장에서 정리정돈 및 청소 왜 해야 할까요?', 'Tại sao phải sắp xếp và dọn dẹp tại nơi làm việc?', '정리정돈과 청소를 해야 넘어짐과 미끄러짐 사고를 막을 수 있기 때문입니다.', 'Cần sắp xếp và dọn dẹp để tránh vấp ngã, trượt ngã.'],
  ['공구가 무엇인가요?', 'Công cụ là gì?', '공구는 작업을 쉽고 정확하게 돕는 도구입니다.', 'Công cụ là dụng cụ giúp làm việc dễ và chính xác hơn.'],
  ['지정된 자리가 무슨 뜻인가요?', 'Vị trí đã định có nghĩa là gì?', '지정된 자리는 물건을 두도록 미리 정해 놓은 위치입니다.', 'Vị trí quy định là nơi đã được định sẵn để đặt đồ.'],
  ['공구를 왜 지정된 자리에 두어야 할까요?', 'Tại sao phải đặt công cụ vào vị trí đã định?', '공구를 제자리에 두어야 분실, 파손, 사고를 막을 수 있기 때문입니다.', 'Cần để công cụ đúng chỗ để tránh mất, hỏng và tai nạn.'],
  ['위생관리가 무엇인가요?', 'Quản lý vệ sinh là gì?', '위생관리는 몸과 작업환경을 깨끗하게 유지하는 관리입니다.', 'Quản lý vệ sinh là giữ cơ thể và môi trường làm việc sạch sẽ.'],
  ['손 씻기 등 위생관리를 왜 해야 할까요?', 'Tại sao phải thực hiện quản lý vệ sinh như rửa tay?', '손을 씻어야 이물질과 화학물질이 몸에 들어가는 것을 막을 수 있기 때문입니다.', 'Cần rửa tay để ngăn bụi bẩn và hóa chất đi vào cơ thể.'],
  ['작업 후 밥 먹기 전에 무엇을 해야 하나요?', 'Bạn nên làm gì trước khi ăn sau khi làm việc?', '밥 먹기 전에는 손을 깨끗이 씻어야 합니다.', 'Trước khi ăn cần rửa tay sạch sẽ.'],
  ['청소·수리 작업이 무엇인가요?', 'Công việc dọn dẹp hoặc sửa chữa là gì?', '청소·수리 작업은 기계를 청소하거나 고장 난 부분을 고치는 작업입니다.', 'Công việc vệ sinh/sửa chữa là làm sạch máy hoặc sửa phần bị hỏng.'],
  ['전원 차단이 무슨 뜻인가요?', 'Bạn có biết "tắt nguồn" có nghĩa là gì không?', '전원 차단은 기계의 전기를 끊는 것입니다.', 'Ngắt nguồn điện là cắt hoàn toàn điện của máy.'],
  ['청소·수리 작업 시 왜 기계 전원을 차단해야 할까요?', 'Tại sao khi làm việc dọn dẹp hoặc sửa chữa phải tắt nguồn máy?', '기계가 갑자기 작동하는 것을 막기 위해서입니다.', 'Để ngăn máy bất ngờ hoạt động.'],
  ['기계의 청소·수리 작업 전에는 무엇을 해야 하나요?', 'Bạn nên làm gì trước khi thực hiện công việc dọn dẹp hoặc sửa chữa máy móc?', '청소·수리 전에는 기계 전원을 차단해야 합니다.', 'Trước khi vệ sinh hoặc sửa chữa cần ngắt nguồn điện của máy.'],
  ['화기 취급이 무엇인가요?', 'Bạn có biết "xử lý nguồn lửa" có nghĩa là gì không?', '화기 취급은 불을 사용하거나 다루는 것입니다.', 'Xử lý/sử dụng nguồn lửa là việc sử dụng hoặc thao tác với lửa.'],
  ['불씨·불티가 무엇인가요?', 'Bạn có biết "tàn lửa và tia lửa" có nghĩa là gì không?', '불씨·불티는 불이 붙을 수 있는 작은 불꽃입니다.', 'Tàn lửa, tia lửa là những đốm lửa nhỏ có thể gây cháy.'],
  ['화기 취급 시 왜 불씨·불티를 확인해야 할까요?', 'Tại sao khi xử lý nguồn lửa phải kiểm tra tàn lửa và tia lửa?', '불씨·불티가 남아 있으면 나중에 화재가 날 수 있기 때문입니다.', 'Cần kiểm tra vì tàn lửa, tia lửa còn sót lại có thể gây cháy sau đó.'],
  ['소화기를 사용할 줄 아나요? 소화기 사용 시 제일 먼저 해야 하는 것은?', 'Bạn có biết cách sử dụng bình chữa cháy không? Khi sử dụng bình chữa cháy, điều đầu tiên phải làm là gì?', '네, 사용할 줄 압니다. 소화기 사용 시 제일 먼저 해야 하는 것은 안전핀을 뽑는 것입니다.', 'Vâng, tôi biết cách sử dụng. Khi sử dụng bình chữa cháy, điều đầu tiên phải làm là rút chốt an toàn.'],

  // Khi xảy ra sự cố & bất thường (17 câu)
  ['화재가 무엇인가요?', 'Bạn có biết "cháy" có nghĩa là gì không?', '화재는 물질이 불에 타며 열과 빛을 내는 현상입니다.', 'Cháy là hiện tượng vật liệu bắt lửa và tạo ra nhiệt, ánh sáng.'],
  ['대피가 무엇인가요?', 'Bạn có biết "sơ tán" có nghĩa là gì không?', '대피는 위험할 때 안전한 곳으로 빨리 이동하는 것입니다.', 'Sơ tán là nhanh chóng di chuyển đến nơi an toàn khi có nguy hiểm.'],
  ['화재 시 왜 대피가 우선일까요?', 'Bạn có biết tại sao khi có cháy, ưu tiên là sơ tán không?', '화재 때는 사람의 생명이 재산보다 중요하기 때문입니다.', 'Khi có cháy, tính mạng con người quan trọng hơn tài sản.'],
  ['119 전화번호를 알고 있나요?', 'Bạn có biết số điện thoại 119 không?', '119는 한국에서 화재나 응급상황 때 신고하는 전화번호입니다.', '119 là số điện thoại báo cháy hoặc cấp cứu ở Hàn Quốc.'],
  ['모르는 작업이 무슨 뜻인가요?', 'Bạn có biết "công việc không biết" có nghĩa là gì không?', '모르는 작업은 방법을 정확히 모르고 하는 작업입니다.', 'Công việc không biết là công việc mình chưa nắm rõ cách làm.'],
  ['물어보기가 무슨 뜻인가요?', 'Hỏi là có nghĩa là gì không?', '물어보기는 모르는 것을 다른 사람에게 질문하는 것입니다.', 'Hỏi là đặt câu hỏi cho người khác về điều mình chưa biết.'],
  ['모르는 작업은 왜 물어봐야 할까요?', 'Bạn có biết tại sao cần phải hỏi về công việc không biết không?', '모르는 작업은 자신과 동료의 안전을 위해 반드시 물어봐야 합니다.', 'Cần hỏi khi không biết để bảo vệ an toàn cho mình và đồng nghiệp.'],
  ['사고 위험이 무엇인가요?', 'Bạn có biết "nguy cơ tai nạn" có nghĩa là gì không?', '사고 위험은 작업 중 다치거나 피해가 생길 수 있는 위험요인입니다.', 'Nguy cơ tai nạn là yếu tố có thể gây thương tích hoặc thiệt hại khi làm việc.'],
  ['발견이 무슨 뜻인가요?', 'Bạn có biết "phát hiện" có nghĩa là gì không?', '발견은 보이지 않던 위험이나 이상을 찾아내는 것입니다.', 'Phát hiện là nhận ra hoặc tìm ra nguy hiểm, bất thường chưa thấy trước đó.'],
  ['사고위험 발견 시 왜 알려줘야 할까요?', 'Bạn có biết tại sao khi phát hiện nguy cơ tai nạn phải thông báo không?', '사고위험을 알려야 다른 사람의 사고를 막을 수 있기 때문입니다.', 'Cần báo nguy cơ tai nạn để ngăn tai nạn cho người khác.'],
  ['폭염이 무엇인가요?', 'Bạn có biết "nắng nóng" có nghĩa là gì không?', '폭염은 최고기온이 33도 이상인 날이 2일 이상 계속되는 현상입니다.', 'Nắng nóng là hiện tượng nhiệt độ cao nhất từ 33 độ trở lên kéo dài trong 2 ngày trở lên.'],
  ['폭염 시 왜 물, 그늘, 휴식을 해야 할까요?', 'Bạn có biết tại sao khi có nắng nóng phải uống nước, nghỉ ngơi và tìm bóng râm không?', '폭염 때는 체온 상승과 탈수를 막기 위해 물, 그늘, 휴식이 필요합니다.', 'Khi nắng nóng cần nước, bóng râm và nghỉ ngơi để tránh tăng nhiệt và mất nước.'],
  ['날씨가 너무 더우면 어떻게 해야 하나요?', 'Bạn nên làm gì khi thời tiết quá nóng?', '날씨가 너무 더우면 물을 자주 마시고 그늘에서 쉬어야 합니다.', 'Khi trời quá nóng cần uống nước thường xuyên và nghỉ trong bóng râm.'],
  ['작업 중지가 무엇인가요?', 'Bạn có biết "dừng công việc" có nghĩa là gì không?', '작업 중지는 위험할 때 즉시 일을 멈추는 것입니다.', 'Dừng công việc là ngừng làm việc ngay khi có nguy hiểm.'],
  ['대피가 무슨 뜻인가요?', 'Bạn có biết "sơ tán" có nghĩa là gì không?', '대피는 위험한 상황에서 안전한 곳으로 빨리 이동하는 것입니다.', 'Sơ tán là nhanh chóng di chuyển đến nơi an toàn khi gặp nguy hiểm.'],
  ['사고 위험 시 왜 작업을 중지하고 대피해야 할까요?', 'Bạn có biết tại sao khi có nguy cơ tai nạn phải dừng công việc và sơ tán không?', '사람의 생명이 기계나 설비보다 중요하기 때문입니다.', 'Vì tính mạng con người quan trọng hơn máy móc và thiết bị.'],
  ['사고의 위험이 있으면 어떻게 해야 하나요?', 'Bạn nên làm gì khi có nguy cơ tai nạn?', '사고 위험이 있으면 작업을 멈추고 안전한 곳으로 대피해야 합니다.', 'Nếu có nguy cơ tai nạn, cần dừng công việc và sơ tán đến nơi an toàn.']
];

sets.push({
  id: 'set_v2_14_antoan_sau_khi_lam_va_su_co',
  title: '14. An toàn lao động - Sau khi làm & Khẩn cấp (34 câu)',
  description: '34 câu hỏi đáp dọn dẹp vệ sinh, ngắt điện, kiểm tra tàn lửa và quy trình ứng phó hỏa hoạn, tai nạn',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: ANTOAN_SAU_34.map((item, idx) => ({
    num: `${idx + 1}.`,
    qKr: item[0],
    qVi: item[1],
    aKr: item[2],
    aVi: item[3]
  }))
});

// Lưu dữ liệu vào file question_sets.json
fs.writeFileSync(SETS_FILE, JSON.stringify(sets, null, 2), 'utf-8');
console.log(`ĐÃ XÂY DỰNG XONG TOÀN BỘ ${sets.length} BỘ CÂU HỎI VÀO ${SETS_FILE}!`);
let totalQuestions = 0;
sets.forEach(s => {
  console.log(`- ${s.title}: ${s.questions.length} câu`);
  totalQuestions += s.questions.length;
});
console.log(`TỔNG CỘNG: ${totalQuestions} CÂU HỎI PHỎNG VẤN VÒNG 2!`);
