"use server";
import { protectSignupRules, protectLoginRules } from "@/arcjet";
import { request } from "@arcjet/next";

// export const protectSignUpAction = async (email: string) => {
//   const req = await request();
//   const decision = await protectSignupRules.protect(req, { email });

//   if (decision.isDenied()) {
//     if (decision.reason.isEmail()) {
//       const emailTypes = decision.reason.emailTypes;
//       if (emailTypes.includes("DISPOSABLE")) {
//         return {
//           error: "Disposable email adress are not allowed",
//           success: false,
//           status: 403,
//         };
//       } else if (emailTypes.includes("INVALID")) {
//         return {
//           error: "Invalid",
//           success: false,
//           status: 403,
//         };
//       } else if (emailTypes.includes("NO_MX_RECORDS")) {
//         return {
//           error:
//             "Email domain does not have a vlaid MX record! Please try with a different email",
//           success: false,
//           status: 403,
//         };
//       }
//     }
//   } else if (decision.reason.isBot()) {
//     return {
//       error: "Bot activity detected",
//       success: false,
//       status: 403,
//     };
//   } else if (decision.reason.isRateLimit()) {
//     return {
//       error: "Too many requests! Please try again",
//       success: false,
//       status: 403,
//     };
//   }
//   return {
//     success: true,
//   };
// };

export const protectSignUpAction = async (email: string) => {
  try {
    const req = await request();
    const decision = await protectSignupRules.protect(req, { email });

    if (decision.isDenied()) {
      if (decision.reason.isEmail()) {
        const emailTypes = decision.reason.emailTypes;
        if (emailTypes.includes("DISPOSABLE")) {
          return {
            error: "Disposable email addresses are not allowed",
            success: false,
            status: 403,
          };
        } else if (emailTypes.includes("INVALID")) {
          return {
            error: "Invalid email address",
            success: false,
            status: 403,
          };
        } else if (emailTypes.includes("NO_MX_RECORDS")) {
          return {
            error:
              "Email domain does not have valid MX Records! Please try with a different email",
            success: false,
            status: 403,
          };
        }
      } else if (decision.reason.isBot()) {
        return {
          error: "Bot activity detected",
          success: false,
          status: 403,
        };
      } else if (decision.reason.isRateLimit()) {
        return {
          error: "Too many requests! Please try again later",
          success: false,
          status: 403,
        };
      }
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Service temporarily unavailable. Please try again later.",
      success: false,
      status: 500,
    };
  }
};

export const protectLoginAction = async (email: string) => {
  try {
    const req = await request();
    const decision = await protectLoginRules.protect(req, { email });

    if (decision.isDenied()) {
      if (decision.reason.isEmail()) {
        const emailTypes = decision.reason.emailTypes;
        if (emailTypes.includes("DISPOSABLE")) {
          return {
            error: "Disposable email addresses are not allowed",
            success: false,
            status: 403,
          };
        } else if (emailTypes.includes("INVALID")) {
          return {
            error: "Invalid email address",
            success: false,
            status: 403,
          };
        } else if (emailTypes.includes("NO_MX_RECORDS")) {
          return {
            error: "Invalid email domain",
            success: false,
            status: 403,
          };
        }
      } else if (decision.reason.isRateLimit()) {
        return {
          error: "Too many attempts. Please try again later",
          success: false,
          status: 429,
        };
      }
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Service temporarily unavailable. Please try again later.",
      success: false,
      status: 500,
    };
  }
};

export const protectSignInAction = async (email: string) => {
  const req = await request();
  const decision = await protectLoginRules.protect(req, { email });

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      const emailTypes = decision.reason.emailTypes;
      if (emailTypes.includes("DISPOSABLE")) {
        return {
          error: "Disposable email address are not allowed",
          success: false,
          status: 403,
        };
      } else if (emailTypes.includes("INVALID")) {
        return {
          error: "Invalid email",
          success: false,
          status: 403,
        };
      } else if (emailTypes.includes("NO_MX_RECORDS")) {
        return {
          error:
            "Email domain does not have valid MX Records! Please try with different email",
          success: false,
          status: 403,
        };
      }
    } else if (decision.reason.isRateLimit()) {
      return {
        error: "Too many requests! Please try again later",
        success: false,
        status: 403,
      };
    }
  }

  return {
    success: true,
  };
};
