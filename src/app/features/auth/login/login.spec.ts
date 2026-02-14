// path: src/app/features/auth/login/login.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login on submit', () => {
    const token = 'test-token';
    component.firebaseToken = token;
    authService.login.and.returnValue(of({ token: 'jwt-token', email: 'test@example.com' }));
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith(token);
  });

  it('should navigate to dashboard on successful login', () => {
    authService.login.and.returnValue(of({ token: 'jwt-token', email: 'test@example.com' }));
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
