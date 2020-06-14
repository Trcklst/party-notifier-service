## Notifier Service

Envoies des evenements en temps réel

## Events

- upload-error : {}
- progress-upload: {trackId, progress, userId}
- uploaded: {trackId, progress, userId}

- party-deleted: {partyId}
- members-updated: {count}
- party-updated: {_id, members, ownerId, name, tracks, limited}

## TODO

- Authentification
