import axios from 'axios';

const CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your SendPulse Client ID
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // Replace with your SendPulse Client Secret
const API_BASE_URL = 'https://api.sendpulse.com';

/**
 * Class to handle SendPulse API operations
 */
class SendPulseService {
  private accessToken: string | null = null;

  /**
   * Retrieves an Access Token from SendPulse API
   */
  private async fetchAccessToken(): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/oauth/access_token`, {
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      });

      this.accessToken = response.data.access_token;
      if (!this.accessToken) {
        throw new Error('Access token not found in response');
      }
      return this.accessToken;
    } catch (error: any) {
      console.error('Failed to fetch access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with SendPulse API');
    }
  }

  /**
   * Ensures an access token is available
   */
  private async getAccessToken(): Promise<string> {
    if (!this.accessToken) {
      await this.fetchAccessToken();
    }
    return this.accessToken!;
  }

  /**
   * Sends an email via SendPulse SMTP API
   * @param fromName - Sender's name
   * @param fromEmail - Sender's email
   * @param toName - Recipient's name
   * @param toEmail - Recipient's email
   * @param subject - Email subject
   * @param htmlContent - HTML content of the email
   */
  public async sendEmail(
    fromName: string,
    fromEmail: string,
    toName: string,
    toEmail: string,
    subject: string,
    htmlContent: string
  ): Promise<void> {
    const accessToken = await this.getAccessToken();

    const emailData = {
      email: {
        from: { name: fromName, email: fromEmail },
        to: [{ name: toName, email: toEmail }],
        subject: subject,
        html: htmlContent,
      },
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/smtp/emails`, emailData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Email sent successfully:', response.data);
    } catch (error: any) {
      console.error('Failed to send email:', error.response?.data || error.message);
      throw new Error('Error while sending email');
    }
  }
}

// Exporting an instance of SendPulseService for use
export const sendPulseService = new SendPulseService();
