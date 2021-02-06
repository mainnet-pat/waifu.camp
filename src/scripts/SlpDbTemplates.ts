export function addressWaifus(address?: string, limit: number = 10, skip: number = 0) {
  let query = {
    "v": 3,
    "q": {
      "db": ["t"],
      "aggregate": [
        {
          "$match": {
            "nftParentId": "a2987562a405648a6c5622ed6c205fca6169faa8afeb96a994b48010bd186a66"
          }
        },
        {
          "$lookup": {
            "from": "graphs",
            "localField": "tokenDetails.tokenIdHex",
            "foreignField": "tokenDetails.tokenIdHex",
            "as": "graph"
          }
        },
        {
          "$match": {
            "graph.graphTxn.outputs.status": "UNSPENT"
          }
        }
      ],
      'sort': {
        'tokenDetails.timestamp_unix': -1,
      },
      "limit": limit,
      "skip": skip
    },
    "r": {
      "f": "[ .[] | { name: .tokenDetails.name, date: .tokenDetails.timestamp_unix, tokenId: .tokenDetails.tokenIdHex, owner: .graph[0].graphTxn.outputs[0].address } ]"
    }
  };

  if (address) {
    if (address.indexOf("simpleledger:") === -1) {
      address = `simpleledger:${address}`;
    }

    (query["q"]["aggregate"] as any[]).push(
      {
        "$match": {
          "graph.graphTxn.outputs.address": address
        }
      }
    );
  }

  return query;
}

export function newWaifus(limit: number = 10, skip: number = 0) {
  return addressWaifus(undefined, limit, skip);
}
