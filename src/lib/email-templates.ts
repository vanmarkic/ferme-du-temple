interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motivation: string;
  besoinsSpecifiques?: string | null;
  infosPrioritaires?: string | null;
}

export function getUserConfirmationEmail(data: InscriptionData) {
  return {
    subject: '✅ Inscription confirmée - Ferme du Temple',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inscription confirmée</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🌱 Ferme du Temple</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 24px;">Bonjour ${data.prenom},</h2>
              
              <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Merci pour votre inscription ! Nous avons bien reçu votre demande et sommes ravis de votre intérêt pour rejoindre notre projet.
              </p>
              
              <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 15px; color: #2d3748; font-size: 18px;">📋 Récapitulatif de votre inscription</h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding: 8px 0; color: #718096; font-size: 14px; font-weight: 600;">Nom :</td>
                    <td style="padding: 8px 0; color: #2d3748; font-size: 14px;">${data.nom} ${data.prenom}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #718096; font-size: 14px; font-weight: 600;">Email :</td>
                    <td style="padding: 8px 0; color: #2d3748; font-size: 14px;">${data.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #718096; font-size: 14px; font-weight: 600;">Téléphone :</td>
                    <td style="padding: 8px 0; color: #2d3748; font-size: 14px;">${data.telephone}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #fff5f5; border-left: 4px solid #fc8181; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 10px; color: #2d3748; font-size: 16px;">📌 Prochaines étapes</h3>
                <ol style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.8;">
                  <li>Notre équipe va examiner votre demande</li>
                  <li>Nous vous contacterons sous 5 à 7 jours ouvrables</li>
                  <li>Nous organiserons une rencontre pour discuter du projet</li>
                </ol>
              </div>
              
              <p style="margin: 30px 0 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Si vous avez des questions en attendant, n'hésitez pas à nous contacter.
              </p>
              
              <p style="margin: 20px 0 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                À très bientôt,<br>
                <strong style="color: #2d3748;">L'équipe de la Ferme du Temple</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #718096; font-size: 14px;">
                Ferme du Temple - Habitat Participatif
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                Cet email a été envoyé suite à votre inscription sur notre site web.
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
  };
}

export function getAdminNotificationEmail(data: InscriptionData) {
  return {
    subject: `🔔 Nouvelle inscription - ${data.prenom} ${data.nom}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle inscription</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="700" cellspacing="0" cellpadding="0" border="0" style="max-width: 700px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">🔔 Nouvelle inscription reçue</h1>
              <p style="margin: 10px 0 0; color: #e6fffa; font-size: 14px;">Ferme du Temple - Dashboard Admin</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 20px; margin: 0 0 30px; border-radius: 4px;">
                <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 20px;">👤 Informations du candidat</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 4px; padding: 15px;">
                  <tr>
                    <td style="padding: 10px; color: #718096; font-size: 14px; font-weight: 600; width: 30%;">Nom complet :</td>
                    <td style="padding: 10px; color: #2d3748; font-size: 15px; font-weight: bold;">${data.prenom} ${data.nom}</td>
                  </tr>
                  <tr style="background-color: #f7fafc;">
                    <td style="padding: 10px; color: #718096; font-size: 14px; font-weight: 600;">Email :</td>
                    <td style="padding: 10px; color: #2d3748; font-size: 15px;"><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; color: #718096; font-size: 14px; font-weight: 600;">Téléphone :</td>
                    <td style="padding: 10px; color: #2d3748; font-size: 15px;"><a href="tel:${data.telephone}" style="color: #667eea; text-decoration: none;">${data.telephone}</a></td>
                  </tr>
                </table>
              </div>
              
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #2d3748; font-size: 18px;">💭 Motivation</h3>
                <div style="background-color: #f7fafc; border-radius: 4px; padding: 20px;">
                  <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.motivation}</p>
                </div>
              </div>
              
              ${
                data.infosPrioritaires
                  ? `
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #2d3748; font-size: 18px;">📌 Informations prioritaires</h3>
                <div style="background-color: #fff5f5; border-radius: 4px; padding: 20px; border-left: 4px solid #fc8181;">
                  <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.infosPrioritaires}</p>
                </div>
              </div>
              `
                  : ''
              }
              
              ${
                data.besoinsSpecifiques
                  ? `
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #2d3748; font-size: 18px;">♿ Besoins spécifiques</h3>
                <div style="background-color: #fffaf0; border-radius: 4px; padding: 20px; border-left: 4px solid #f6ad55;">
                  <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.besoinsSpecifiques}</p>
                </div>
              </div>
              `
                  : ''
              }
              
              <div style="margin: 40px 0 0; padding-top: 30px; border-top: 2px solid #e2e8f0;">
                <p style="margin: 0; color: #718096; font-size: 14px;">
                  <strong>Actions suggérées :</strong><br>
                  1. Vérifier les informations dans le dashboard Supabase<br>
                  2. Contacter le candidat sous 5-7 jours<br>
                  3. Planifier une rencontre si le profil correspond
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                Ferme du Temple - Système de gestion des inscriptions
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
  };
}
