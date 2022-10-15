import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import fetch from 'node-fetch';

const airlabs = (iata: string) =>
  `https://airlabs.co/api/v9/airports?iata_code=${encodeURIComponent(
    iata
  )}&api_key=6d660a02-43ea-46fe-b79d-26ba567dc8fd`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  const session = await getSession({ req });
  console.log(session);

  const departureInfo = await fetch(airlabs(body.departure)).then(r =>
    r.json()
  );
  const arrivalInfo = await fetch(airlabs(body.departure)).then(r => r.json());

  res.end();
}
