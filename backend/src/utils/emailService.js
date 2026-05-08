import nodemailer from "nodemailer";
import {ApiError} from "./ApiError";
// email transporter => for connecting to your email service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendEmailInvitation = async (invitedEmail, vaultName, inviterName, invitationLink) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: invitedEmail,
            subject: `You're invited to join ${vaultName} vault in SyncScript`,
            html: `
                <h2>Hello!</h2>
                <p>${inviterName} has invited you to join their ${vaultName} vault in SyncScript.</p>
    
                <p><strong>To accept this invitation:</strong></p>
                <a href="${invitationLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;" >
                    Accept Invitation
                </a>
    
                <p>Or copy this link: ${invitationLink}</p>
    
                <p><em>This link expires in 7 days.</em></p>
    
                <p>Best regards,<br />SyncScript Team</p>
            `
        };
    
        await transporter.sendMail(mailOptions);
        console.log(`Invitation email send to ${invitedEmail}`);
    } catch (error) {
        console.error('Error sending invitation email', error);
        throw new ApiError(500, 'Failed to send invitation email');
    }
};