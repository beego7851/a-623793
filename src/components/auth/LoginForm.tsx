import { useLoginForm } from './login/useLoginForm';
import MemberNumberInput from './login/MemberNumberInput';
import PasswordInput from './login/PasswordInput';
import LoginButton from './login/LoginButton';
import LegalLinks from './login/LegalLinks';
import { ForgotPasswordButton } from './login/ForgotPasswordButton';

const LoginForm = () => {
  const { memberNumber, password, setMemberNumber, setPassword, loading, handleLogin } = useLoginForm();

  return (
    <div className="bg-dashboard-card rounded-lg shadow-lg p-8 mb-12">
      <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
        <MemberNumberInput
          memberNumber={memberNumber}
          setMemberNumber={setMemberNumber}
          loading={loading}
        />

        <PasswordInput
          password={password}
          setPassword={setPassword}
          loading={loading}
        />

        <div className="space-y-4">
          <LoginButton loading={loading} />
          <ForgotPasswordButton />
        </div>
        
        <div className="flex justify-end">
          <LegalLinks />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;