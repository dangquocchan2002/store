package poly.store.config;

import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import poly.store.entity.Account;
import poly.store.service.AccountService;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	@Autowired
	
	AccountService accountService;
	@Autowired
	BCryptPasswordEncoder pe;
	
	//cung cap nguon du lieu dang nhap
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception{
		//viết phương thức userDetailsService với username
		auth.userDetailsService(username ->{
			try {
				//tim kiem account thong qua username
				Account user = accountService.findById(username);
				//lây password ra và mã hóa
				String password = pe.encode(user.getPassword());
				//lấy vai trò của người dùng
				String[] roles = user.getAuthorities().stream()
						.map(er -> er.getRole().getId())
						.collect(Collectors.toList()).toArray(new String[0]);
				//thông qua User.withUsername tạo ra userdetail và trả về 
				return User.withUsername(username).password(password).roles(roles).build();
			} catch (NoSuchElementException e) {
				//nếu ko tồn tại nén ra ngoại lệ
				throw new UsernameNotFoundException(username + "not found");
			}
		});
	}
	
	//phan quyen su dung 
	@Override
	protected void configure(HttpSecurity http) throws Exception{
		http.csrf().disable();
		http.authorizeRequests()
		//địa chỉ bắt đầu bằng form order thì phải đăng nhập
		.antMatchers("/order/**").authenticated() 
		.antMatchers("/admin/**").hasAnyRole("STAF", "DIRE")
		.antMatchers("/rest/authorities").hasRole("DIRE")
		.anyRequest().permitAll();
		
		http.formLogin()
		//địa chỉ dẫn đến form đăng nhập(SecurityController)
		.loginPage("/security/login/form")
		.loginProcessingUrl("/security/login")
		//dang nhap thanh cong thi chuyen den form success
		.defaultSuccessUrl("/security/login/success", false)
		//dang nhap loi thi chuyen den form lỗi
		.failureUrl("/security/login/error");
		
		http.rememberMe()
		.tokenValiditySeconds(86400);
		
		//dang nhap nhung den dia chi ko dc cap quyen
		http.exceptionHandling()
		.accessDeniedPage("/security/unauthoried");
		
		//dang xuat
		http.logout()
		.logoutUrl("/security/logoff")
		.logoutSuccessUrl("/security/logoff/success");
	}
	
	//co che ma hoa mat khau
	@Bean
	public BCryptPasswordEncoder getPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	//cho phep truy xuat REST API tu ben ngoai(domain khac)
	@Override
	public void configure(WebSecurity web) throws Exception{
		web.ignoring().antMatchers(HttpMethod.OPTIONS, "/**");
	}
	
	
}
