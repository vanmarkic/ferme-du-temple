import type { Resend } from 'resend';
import type { Mission, Member, Meeting } from '../../types/odj-pv';

// Lazy initialize Resend only when needed (server-side only)
let resend: Resend | null = null;

async function getResend(): Promise<Resend> {
  if (!resend) {
    // Dynamic import to avoid loading Resend on client
    const { Resend: ResendClass } = await import('resend');
    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resend = new ResendClass(apiKey);
  }
  return resend;
}

interface SendMissionEmailParams {
  mission: Mission;
  member: Member;
  meeting: Meeting;
}

export async function sendMissionEmail({
  mission,
  member,
  meeting,
}: SendMissionEmailParams): Promise<boolean> {
  // Check if member has email
  if (!member.email) {
    console.warn(`Member ${member.name} has no email address`);
    return false;
  }

  const formattedDate = new Date(meeting.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const baseFromEmail = import.meta.env.FROM_EMAIL || 'onboarding@resend.dev';
  const fromEmail = `"BEAVER" <${baseFromEmail}>`;

  try {
    const resendClient = await getResend();
    await resendClient.emails.send({
      from: fromEmail,
      to: member.email,
      subject: `Mission - Réunion BEAVER ${formattedDate}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mission assignée</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">BEAVER</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 24px;">Bonjour ${member.name},</h2>

              <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Suite à la réunion du <strong>${formattedDate}</strong>, tu as été chargé·e de :
              </p>

              <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; color: #2d3748; font-size: 16px; line-height: 1.6; font-weight: 600;">
                  ${mission.description}
                </p>
              </div>

              <p style="margin: 30px 0 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Cordialement,<br>
                <strong style="color: #2d3748;">L'équipe BEAVER</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #718096; font-size: 14px;">
                BEAVER - Habitat Participatif
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                Cet email a été envoyé automatiquement suite à la réunion du ${formattedDate}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send mission email:', error);
    return false;
  }
}

export async function sendMissionEmails(
  missions: Mission[],
  members: Member[],
  meeting: Meeting
): Promise<{ sent: string[]; failed: string[] }> {
  const results = {
    sent: [] as string[],
    failed: [] as string[],
  };

  // Create a map of member IDs to members for quick lookup
  const memberMap = new Map<string, Member>();
  members.forEach((member) => {
    memberMap.set(member.id, member);
  });

  // Process each mission
  for (const mission of missions) {
    // Skip missions without an assigned member
    if (!mission.member_id) {
      console.warn(`Mission ${mission.id} has no assigned member, skipping`);
      continue;
    }

    // Get the member
    const member = memberMap.get(mission.member_id);
    if (!member) {
      console.warn(
        `Member ${mission.member_id} not found for mission ${mission.id}`
      );
      results.failed.push(mission.id);
      continue;
    }

    // Send the email
    const success = await sendMissionEmail({ mission, member, meeting });

    if (success) {
      results.sent.push(mission.id);
    } else {
      results.failed.push(mission.id);
    }
  }

  return results;
}
