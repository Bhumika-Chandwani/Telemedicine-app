const getBaseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .footer {
            background: #f8f9fa;
            color: #6c757d;
            padding: 15px;
            text-align: center;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-approved { background-color: #d4edda; color: #155724; }
        .status-disapproved { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Telemedicine Platform</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Telemedicine Platform. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

export const doctorApprovedTemplate = (name) => getBaseTemplate(`
    <h2>Account Approved!</h2>
    <p>Hello Dr. ${name},</p>
    <p>Your profile has been <strong>approved</strong> by our administration team.</p>
    <div class="status-badge status-approved">Status: Approved</div>
    <p>You can now log in to your dashboard and start accepting consultations.</p>
    <a href="${process.env.FRONTEND_URL || '#'}" class="button">Login to Dashboard</a>
`);

export const doctorDisapprovedTemplate = (name, reason) => getBaseTemplate(`
    <h2>Application Status Update</h2>
    <p>Hello Dr. ${name},</p>
    <p>Your profile could not be approved at this time.</p>
    <div class="status-badge status-disapproved">Status: Not Approved</div>
    <p><strong>Reason:</strong></p>
    <blockquote style="border-left: 4px solid #f8d7da; padding-left: 15px; font-style: italic;">
        ${reason}
    </blockquote>
`);

export const doctorDeletedTemplate = (name) => getBaseTemplate(`
    <h2>Account Removed</h2>
    <p>Hello Dr. ${name},</p>
    <p>Your account has been removed by the administrator.</p>
    <p>If you believe this was an error, please contact support.</p>
`);