import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center justify-center px-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(#8dff2d 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
          {/* Glow effect */}
          <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-[#8dff2d] opacity-10 blur-[100px]" />
        </div>
      </div>
      <div className="relative z-10">
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/signup"
          redirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#8dff2d",
              colorBackground: "#191919",
              colorInputBackground: "#252525",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "#9ca3af",
              colorSuccess: "#8dff2d",
              colorDanger: "#ef4444",
              colorWarning: "#f59e0b",
              colorNeutral: "#6b7280",
              fontFamily: '"Inter", system-ui, sans-serif',
              borderRadius: "12px",
              spacingUnit: "1rem",
            },
            elements: {
              card: {
                backgroundColor: "#191919",
                border: "1px solid #333333",
                borderRadius: "16px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              },
              headerTitle: {
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "700",
                marginBottom: "8px",
              },
              headerSubtitle: {
                color: "#9ca3af",
                fontSize: "16px",
              },
              socialButtonsBlockButton: {
                backgroundColor: "#252525",
                border: "1px solid #333333",
                color: "#ffffff",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                "&:hover": {
                  backgroundColor: "#333333",
                },
              },
              dividerLine: {
                backgroundColor: "#333333",
              },
              dividerText: {
                color: "#9ca3af",
                fontSize: "14px",
              },
              formFieldLabel: {
                color: "#d1d5db",
                fontSize: "14px",
                fontWeight: "500",
              },
              formFieldInput: {
                backgroundColor: "#252525",
                border: "1px solid #333333",
                color: "#ffffff",
                borderRadius: "8px",
                "&::placeholder": {
                  color: "#6b7280",
                },
                "&:focus": {
                  borderColor: "#8dff2d",
                  boxShadow: "0 0 0 2px rgba(141, 255, 45, 0.2)",
                },
              },
              formButtonPrimary: {
                backgroundColor: "#8dff2d",
                color: "#000000",
                borderRadius: "25px",
                fontWeight: "600",
                fontSize: "16px",
                padding: "12px 24px",
                "&:hover": {
                  backgroundColor: "#7be525",
                },
              },
              footerActionLink: {
                color: "#8dff2d",
                fontWeight: "500",
                "&:hover": {
                  color: "#7be525",
                },
              },
              footerActionText: {
                color: "#9ca3af",
              },
              formFieldSuccessText: {
                color: "#8dff2d",
                fontSize: "14px",
              },
              formFieldErrorText: {
                color: "#ef4444",
                fontSize: "14px",
              },
              formFieldHintText: {
                color: "#6b7280",
                fontSize: "14px",
              },
              modalCloseButton: {
                color: "#8dff2d",
                "&:hover": {
                  color: "#7be525",
                  backgroundColor: "rgba(141, 255, 45, 0.1)",
                },
              },
            },
            layout: {
              socialButtonsPlacement: "top",
              showOptionalFields: false,
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;

