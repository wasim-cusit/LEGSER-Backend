const emailContent = (logoURL, body) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            width: 80%;
            padding: 0px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: 0px auto;
            max-width: 600px;
        }
          
        h2 {
            margin: 0px 0px 9px 0px;
        }

        .logo {
            width: 45px;
            height: 44px;
            background: #ffffff;
            padding: 2px;
            border-radius: 50%;
        }

        .content {
            padding: 20px 20px 0px 20px;
            color: #333333;
            line-height: 1.6;
        }

        .content h3 {
            color: #0073e6;
            margin: 0px 0px 9px 0px;
        }

        .content p {
            margin-bottom: 10px;
        }
            
        .content .ys {
            margin: 0px 0px;
        }
 
        .footer {
            background-color: #0073e6;
            color: #ffffff;
            text-align: center;
            padding: 2px;
            font-size: 12px;
        }

        .footer a {
            color: #ffffff;
            text-decoration: underline;
        }
    </style>
</head>

<body>
<div style="background-color:#f4f4f4">
    <div class="container">
        <!-- Header -->
       <div class="header">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center" style="background-color: #0073e6; padding: 6px 0; vertical-align: middle;">
                        <img class="logo" src="${logoURL}" style="vertical-align: middle; display: inline-block; width: 34px; height: 34px; background: #ffffff; padding: 2px; border-radius: 50%;" />
                        <h2 style="display: inline-block; margin: 0; margin-left: 3px; color: #ffffff; font-family: Arial, sans-serif; vertical-align: middle;">K2X Tech Run</h2>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Body -->
       ${body}

        <!-- Footer -->
        <div class="footer">
            <p>© 2025 KTR. All rights reserved.</p>
        </div>
    </div>
    </div>
</body>
</html>
`;

module.exports = emailContent;
