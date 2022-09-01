package poly.store.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import poly.store.interceptor.GlobalInterceptor;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer{
	@Autowired
	GlobalInterceptor globalInterceptor;
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		//nhung trang nao muon hien thi category tu GlobalInterceptor
		registry.addInterceptor(globalInterceptor)
		.addPathPatterns("/**")
		//loai trừ ra 
		.excludePathPatterns("/rest/**", "/admin/**", "/assets/**");
	}

}
