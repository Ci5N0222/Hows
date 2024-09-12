package com.hows.member.controller;


import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hows.common.CustomUserDetails;
import com.hows.common.util.JwtUtil;
import com.hows.member.dto.MemberDTO;
import com.hows.member.dto.SignInResponseDTO;
import com.hows.member.service.MemberService;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private MemberService memServ;
	@Autowired
	private PasswordEncoder pwEncoder;
	@Autowired
	private JwtUtil jwt;
	
	// 로그인
	@PostMapping
	public ResponseEntity<SignInResponseDTO> login(@RequestBody MemberDTO dto){

		System.out.println("id : " + dto.getMember_id() + " / pw : " + dto.getPw());

	    // 사용자 존재 여부 확인
		CustomUserDetails existingUser = memServ.loadUserByUsername(dto.getMember_id());
	    if (existingUser == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
	    }
	    
	    // 비밀번호 검증
	    if (!pwEncoder.matches(dto.getPw(), existingUser.getPassword())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
	    }

	    // 로그인 성공 시 토큰 생성
	    String token = jwt.createToken(existingUser.getUsername(), existingUser.getMemberSeq());
	    String member_id = existingUser.getUsername();
        int member_seq = existingUser.getMemberSeq();
		return ResponseEntity.ok(new SignInResponseDTO(token, member_id,member_seq));
	}
	
	// 아이디 찾기
	@PostMapping("/findId")
	public ResponseEntity<String> findId(@RequestBody Map<String, String> request){
		
		String name = request.get("name");
		String email = request.get("email");
		
		Map<String, String> map = new HashMap<>();
		map.put("name", name);
		map.put("email", email);
		
		String foundId = memServ.findId(map);
		
		return ResponseEntity.ok(foundId);
	}
	
//	// 비밀번호 찾기 - 아이디, 이메일 존재여부 검증
//	@PostMapping("/verifyUser")
//	public ResponseEntity<Boolean> verifyUser(@RequestParam String member_id, @RequestParam String email){
//		
//		Map<String, String> map = new HashMap<>();
//		map.put("member_id", member_id);
//		map.put("email", email);
//		
//		Boolean result = memServ.verifyUser(map);
//		return ResponseEntity.ok(result);
//	}
	
	// 비밀번호 찾기 - 비밀번호 변경
//	@PostMapping("/changePw")
//	public ResponseEntity<Integer> changePw(@RequestParam Map<String, String> request){
//		String member_id = request.get("member_id");
//		String pw = pwEncoder.encode(request.get("pw"));
//	    String email = request.get("email");
//
//	    Map<String, String> map = new HashMap<>();
//	    map.put("member_id", member_id);
//	    map.put("pw", pw);
//	    map.put("email", email);
//
//	    int result = memServ.changePw(map);
//	    if (result > 0) {
//	        return ResponseEntity.ok(result);
//	    } else {
//	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
//	    }
//	}

	
	// 비밀번호 찾기 - 아이디, 이메일 존재여부 검증 및 임시 비밀번호 발급
	@PostMapping("/sendTempPw")
    public ResponseEntity<Boolean> sendTemporaryPassword(@RequestBody Map<String,String> request) {
		
		String member_id = request.get("member_id");
	    String email = request.get("email");
		
	    System.out.println(member_id);

		System.out.println(email);
		
        Boolean result = memServ.sendTempPw(member_id, email);
        return ResponseEntity.ok(result);
    }
	

	
	@ExceptionHandler(Exception.class)
	   public ResponseEntity<String> exceptionHandler(Exception e) {
	      e.printStackTrace();
	      return ResponseEntity.badRequest().body("fail");
	   }
	
	
	
	
}
