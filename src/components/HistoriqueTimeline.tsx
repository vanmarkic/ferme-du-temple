export function HistoriqueTimeline() {
  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            color: '#2d3748',
            marginBottom: '10px',
            fontSize: '2.5em',
          }}
        >
          📍 Ferme du Temple
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: '#718096',
            marginBottom: '50px',
            fontSize: '1.1em',
          }}
        >
          Chronologie d'une acquisition complexe Avril 2024 - Octobre 2025
        </p>




          <div className="timeline">

            <div className="timeline-item">
                <div className="timeline-dot positive"></div>
                <div className="timeline-content positive">
                    <div className="date">AVRIL 2024</div>
                    <div className="event-title">✅ Offre acceptée</div>
                    <div className="event-description">
                        Le collectif Habitat Beaver (7 personnes) fait une offre de 715 000€ pour 6,34 hectares. La Fondation Roi Baudouin accepte.
                        <span className="tag prix">715 000€</span>
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot warning"></div>
                <div className="timeline-content warning">
                    <div className="date">17 MAI 2024</div>
                    <div className="event-title">🍄 Découverte de mérule</div>
                    <div className="event-description">
                        Découverte de mérule dans le bâtiment. Le collectif signale à la Fondation, demande protection contre infiltrations. L'offre mentionnait pourtant l'absence de champignons nuisibles. Le collectif accepte d'en assumer le traitement.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot critical"></div>
                <div className="timeline-content critical">
                    <div className="date">19 JUIN 2024</div>
                    <div className="event-title">🔬 Mérule confirmée</div>
                    <div className="event-description">
                        Analyses de laboratoire (Hainaut Analyses) confirment la présence avérée de mérule. Demande de devis auprès de sociétés spécialisées (Protector, Bioprotect).
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot warning"></div>
                <div className="timeline-content warning">
                    <div className="date">AOÛT 2024</div>
                    <div className="event-title">💰 Première négociation prix</div>
                    <div className="event-description">
                        M. Lange (FRB) propose de baisser le prix de 715 000€ à 700 000€ contre abandon des clauses sur la fuite d'eau et la mérule. Le collectif accepte.
                        <span className="tag prix">-15 000€</span>
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot positive"></div>
                <div className="timeline-content positive">
                    <div className="date">NOVEMBRE 2024</div>
                    <div className="event-title">🤝 Premier accord avec M. Durez</div>
                    <div className="event-description">
                        Accord trouvé : M. Durez conserve l'occupation de la parcelle 206L (libération d'une bande de 30m), renonce à son droit de préemption.
                        <span className="tag prix">+30 000€</span>
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot critical"></div>
                <div className="timeline-content critical">
                    <div className="date">DÉCEMBRE 2024</div>
                    <div className="event-title">💥 Révélations choc</div>
                    <div className="event-description">
                        <strong>6 parcelles occupées</strong> par M. Durez (pas seulement 1), droit de préemption existant, 2 parcelles appartiennent à ORES et ne peuvent être vendues. "Le bien n'était visiblement pas prêt à être vendu"
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot critical"></div>
                <div className="timeline-content critical">
                    <div className="date">JANVIER 2025</div>
                    <div className="event-title">🏚️ Aggravation mérule</div>
                    <div className="event-description">
                        Remplacement des bâches de toiture après 9 mois d'infiltrations continues. La mérule s'est propagée jusqu'au rez-de-chaussée.
                        <span className="tag durée">9 mois d'attente</span>
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot critical"></div>
                <div className="timeline-content critical">
                    <div className="date">MARS-AVRIL 2025</div>
                    <div className="event-title">🔍 Vérité révélée par Me Franeau</div>
                    <div className="event-description">
                        Le notaire vendeur révèle avoir "signalé depuis fort longtemps" l'occupation Durez à l'agence, mais "l'agence n'a pas tenu compte". La Fondation "a hérité sans savoir". M. Durez souhaite un contact direct car "les relations avec l'agence sont difficiles".
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot positive"></div>
                <div className="timeline-content positive">
                    <div className="date">AVRIL 2025</div>
                    <div className="event-title">🤝 2e accord avec M. Durez</div>
                    <div className="event-description">
                        Contact téléphonique avec M. Durez. Solution du <strong>commodat</strong> proposée : occupation gratuite 5 ans de la parcelle 206L (sauf bande 30m), avec renonciation au bail à ferme et au droit de préemption.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot warning"></div>
                <div className="timeline-content warning">
                    <div className="date">MAI 2025</div>
                    <div className="event-title">📉 Nouvelle offre ajustée</div>
                    <div className="event-description">
                        Offre réduite à 630 000€ compte tenu des problèmes. La Fondation contre-propose 650 000€ avec signature avant le 1er juillet. Le collectif accepte.
                        <span className="tag prix">650 000€</span>
                        <span className="tag durée">Délai : 1er juillet</span>
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot warning"></div>
                <div className="timeline-content warning">
                    <div className="date">2 JUIN 2025</div>
                    <div className="event-title">📄 Demande de compromis</div>
                    <div className="event-description">
                        Le collectif demande le compromis adapté à l'agence immobilière.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot critical"></div>
                <div className="timeline-content critical">
                    <div className="date">16-19 JUIN 2025</div>
                    <div className="event-title">⏰ Rien reçu, délai impossible</div>
                    <div className="event-description">
                        16 juin : Me Carrion n'a toujours rien reçu, délai du 1er juillet impossible à tenir. 17 juin : Premier projet avec erreurs sur parcelles. 19 juin : Bon projet enfin reçu.
                        <span className="tag durée">17 jours perdus</span>
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot warning"></div>
                <div className="timeline-content warning">
                    <div className="date">30 JUIN 2025</div>
                    <div className="event-title">⚠️ Pression pour signature</div>
                    <div className="event-description">
                        Me Franeau insiste pour signature le 1er juillet. Me Carrion rappelle : "Cela fait déjà un an que les acquéreurs sont désireux d'acquérir". Demande de compréhension.
                        <span className="tag durée">1 an écoulé</span>
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot critical"></div>
                <div className="timeline-content critical">
                    <div className="date">4-7 JUILLET 2025</div>
                    <div className="event-title">🔍 Blocages identifiés</div>
                    <div className="event-description">
                        3 points à clarifier : servitudes ORES/Elia, nature occupation Durez (bail ou précaire?), conditions suspensives crédit. La Fondation maintient ses exigences : 65% crédit, 5 semaines.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot warning"></div>
                <div className="timeline-content warning">
                    <div className="date">18-29 JUILLET 2025</div>
                    <div className="event-title">📋 Demandes de documents</div>
                    <div className="event-description">
                        18 juillet : Recherches servitudes demandées + intervention Durez. 28 juillet : Document signé Durez demandé. 29 juillet : Me Franeau demande au notaire du collectif de préparer le commodat.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot critical"></div>
                <div className="timeline-content critical">
                    <div className="date">11 AOÛT 2025</div>
                    <div className="event-title">🔄 Ping-pong notaires</div>
                    <div className="event-description">
                        Le collectif demande l'avancement. Me Franeau renvoie vers notaire du collectif : en attente de la convention d'occupation précaire (demandée le 29 juillet). Chacun attend l'autre.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot warning"></div>
                <div className="timeline-content warning">
                    <div className="date">11-15 SEPTEMBRE 2025</div>
                    <div className="event-title">📞 Urgence non résolue</div>
                    <div className="event-description">
                        11 sept : Yves Lange (agence) cherche à contacter le collectif. 15 sept : Urgence de réponse demandée.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot critical"></div>
                <div className="timeline-content critical">
                    <div className="date">17-18 SEPTEMBRE 2025</div>
                    <div className="event-title">🚧 Impasse totale</div>
                    <div className="event-description">
                        17 sept : Le collectif liste 2 blocages : pas de certitude Durez, servitudes manquantes. 18 sept : Sarah Casier répond que la Fondation estime qu'il n'y a plus d'obstacles. Convention Durez soumise. Le commodat est attendu du notaire collectif "depuis fin juillet". Incompréhension mutuelle.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot warning"></div>
                <div className="timeline-content warning">
                    <div className="date">7-8 OCTOBRE 2025</div>
                    <div className="event-title">👔 Changement de notaire</div>
                    <div className="event-description">
                        Me Irène Carrion Jurado remplacée par Me Pierre-Yves Erneux. 7 oct : Résumé complet du dossier préparé. 8 oct : Me Erneux reçoit et révise le projet de compromis.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <div className="date">14 OCTOBRE 2025</div>
                    <div className="event-title">🏢 Contact urbanisme</div>
                    <div className="event-description">
                        Le collectif contacte l'urbanisme de Frameries pour présenter le projet d'habitat groupé.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot critical"></div>
                <div className="timeline-content critical">
                    <div className="date">15 OCTOBRE 2025 - 12h33</div>
                    <div className="event-title">🚨 Email alarmant de la Fondation</div>
                    <div className="event-description">
                        Auriane Van Hecke liste 3 blocages : <strong>1) Malentendu Durez</strong> - il croyait occuper TOUTES les parcelles (sauf 30m), pas seulement 206L. Refus catégorique clause amendée. <strong>2) Condition permis</strong> fragilise vente. <strong>3) Pas d'accord bancaire.</strong> "Les évolutions successives nous amènent à nous interroger sur l'équilibre de cette vente"
                        <span className="tag durée">18 mois écoulés</span>
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot positive"></div>
                <div className="timeline-content positive">
                    <div className="date">15 OCTOBRE 2025 - 12h59</div>
                    <div className="event-title">🛡️ Me Erneux clarifie</div>
                    <div className="event-description">
                        "Sauf erreur, les exigences reprises ne sont pas miennes". <strong>Pas de condition permis</strong> postulée. Condition crédit "était dans le projet" mais problématique en collectif. Les acquéreurs veulent seulement clarifier l'occupation.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot critical"></div>
                <div className="timeline-content critical">
                    <div className="date">15 OCTOBRE 2025 - 13h29</div>
                    <div className="event-title">❌ Me Franeau refuse</div>
                    <div className="event-description">
                        "Je ne pense pas qu'il soit utile que les notaires participent". Points 2 et 3 "ajoutés par après, le vendeur n'est pas tenu de les accepter". Suggère rencontre directe sans notaires. "C'est le manque de discussion directe qui a créé cette situation"
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot positive"></div>
                <div className="timeline-content positive">
                    <div className="date">15 OCTOBRE 2025 - 13h33-15h41</div>
                    <div className="event-title">✅ Me Erneux insiste</div>
                    <div className="event-description">
                        "On leur a prêté des intentions qui n'étaient pas les leurs. Au contraire, ils veulent avancer". Sur Durez : "accord pour 5 ans (206L - 30m), on ne peut leur reprocher de manquer de souplesse". <strong>15h41 - Clarification définitive : "AUCUNE condition suspensive permis n'a été demandée".</strong> Idem crédit. "Très peu de chose à voir"
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot warning"></div>
                <div className="timeline-content warning">
                    <div className="date">15 OCTOBRE 2025 - 14h32</div>
                    <div className="event-title">🕊️ Sarah Casier apaise</div>
                    <div className="event-description">
                        "Jamais dans l'intention de prêter aux acquéreurs des intentions fausses". Rencontre avec Durez révèle "un malentendu ait persisté". Frustration : "chaque fois qu'un point semble résolu, de nouvelles demandes apparaissent". Condition : représentant avec pouvoir d'engagement à la visio.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot positive"></div>
                <div className="timeline-content positive">
                    <div className="date">15 OCTOBRE 2025 - 15h12-17h12</div>
                    <div className="event-title">🤝 Collectif accepte réunion</div>
                    <div className="event-description">
                        Colin Ponthot accepte visio du 16 octobre 13h45. Demande si M. Durez sera présent. Me Erneux partagera "info claire sur structuration juridique". Ton conciliant : "Veuillez croire à notre enthousiasme certain et conciliant". Lien Webex transmis.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot critical"></div>
                <div className="timeline-content critical">
                    <div className="date">15 OCTOBRE 2025 - 15h18</div>
                    <div className="event-title">🚫 Franeau persiste</div>
                    <div className="event-description">
                        "Je ne serai pas présent, ne pouvant me libérer au moment fixé sans me consulter". "Doute fort que M. Durez participe également". "Dès lors, je pense qu'il n'est pas utile"
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <div className="date">15 OCTOBRE 2025 - 15h45</div>
                    <div className="event-title">🎯 Point focal identifié</div>
                    <div className="event-description">
                        Me Franeau : "Alors, il ne reste que l'occupation à discuter ! Ça simplifie fort les choses et la présence des notaires se justifie encore moins"
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <div className="date">15 OCTOBRE 2025 - 16h39</div>
                    <div className="event-title">📧 Lien Teams envoyé</div>
                    <div className="event-description">
                        Van Hecke confirme réunion 16 octobre 13h45. Envoie lien Teams (pas le Webex du collectif). Derniers préparatifs avant la rencontre décisive.
                    </div>
                </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <div className="date">16 OCTOBRE 2025</div>
                    <div className="event-title">🎯 Réunion décisive (13h45)</div>
                    <div className="event-description">
                        Visioconférence prévue entre Fondation et collectif. Me Franeau (notaire vendeur) refuse de participer. Présence de M. Durez incertaine. Point de rupture ou issue ?
                    </div>
                </div>
            </div>
        </div>

        <div className="legend">
            <div className="legend-item">
                <div className="legend-dot positive"></div>
                <span>Événement positif</span>
            </div>
            <div className="legend-item">
                <div className="legend-dot warning"></div>
                <span>Avertissement</span>
            </div>
            <div className="legend-item">
                <div className="legend-dot critical"></div>
                <span>Problème critique</span>
            </div>
            <div className="legend-item">
                <div className="legend-dot neutral"></div>
                <span>Événement neutre</span>
            </div>
        </div>
    </div>

        <div style={{ position: 'relative', padding: '20px 0' }}>
          {/* Timeline line */}
          <div
            style={{
              content: '',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '100%',
              background: 'linear-gradient(to bottom, #667eea, #764ba2)',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
