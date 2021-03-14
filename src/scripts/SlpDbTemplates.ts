export function addressWaifus(address?: string, limit: number = 10, skip: number = 0) {
  return newWaifus(address, limit, skip);
  // return addressWaifusOverToken(address, limit, skip);
}

export function addressWaifusOverToken(address?: string, limit: number = 10, skip: number = 0) {
  let query = {
    "v": 3,
    "q": {
      "db": ["t"],
      "aggregate": [
        {
          "$match": {
            "nftParentId": "a2987562a405648a6c5622ed6c205fca6169faa8afeb96a994b48010bd186a66",
            "lastUpdatedBlock": {
              "$gt": 670000
            }
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
      "sort": {
        "tokenDetails.timestamp_unix": -1
      },
      "limit": limit,
      "skip": skip
    },
    "r": {
      "f": "[ .[] | { name: .tokenDetails.name, date: .tokenDetails.timestamp_unix, tokenId: .tokenDetails.tokenIdHex, owner: .graph[-1].graphTxn.outputs[0].address } ]"
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

  console.log(JSON.stringify(query, null, 2));

  return query;
}

export function addressWaifusOverGraph(address?: string, limit: number = 10, skip: number = 0) {
  let query = {
    "v": 3,
    "q": {
        "db": ["g"],
        "aggregate": [
            {
                "$match": {
                    "tokenDetails.nftGroupIdHex": "a2987562a405648a6c5622ed6c205fca6169faa8afeb96a994b48010bd186a66",
                    // "graphTxn.outputs.address": address,
                    "graphTxn.outputs.status": "UNSPENT"
                }
            },
            {
                "$unwind": "$graphTxn.outputs"
            },
            {
                "$match": {
                    // "graphTxn.outputs.address": address,
                    "graphTxn.outputs.status": "UNSPENT"
                }
            },
            {
                "$project": {
                    "graphTxn": 1
                }
            },
            {
              "$lookup": {
                "from": "tokens",
                "localField": "graphTxn.details.tokenIdHex",
                "foreignField": "tokenDetails.tokenIdHex",
                "as": "token"
              }
            }
        ],
        "sort": {
          "token.tokenDetails.timestamp_unix": -1
        },
        "limit": limit,
        "skip": skip
    },
    "r": {
      "f": "[ .[] | { name: .token[0].tokenDetails.name, date: .token[0].tokenDetails.timestamp_unix, tokenId: .token[0].tokenDetails.tokenIdHex, owner: .graphTxn.outputs.address } ]"
    }
  };

  if (address) {
    if (address.indexOf("simpleledger:") === -1) {
      address = `simpleledger:${address}`;
    }

    (query["q"]["aggregate"] as any[])[0]["$match"]["graphTxn.outputs.address"] = address;
    (query["q"]["aggregate"] as any[])[2]["$match"]["graphTxn.outputs.address"] = address;
  }

  // console.log(JSON.stringify(query, null, 2));

  return query;
}

export function newWaifus(address?: string, limit: number = 10, skip: number = 0) {
  let query = {
    "v": 3,
    "q": {
      "db": ["c", "u"],
      "aggregate": [
        {
          "$match": {
            "slp.valid": true,
            "slp.detail.versionType": 65,
            "slp.detail.symbol": "WAIFU",
            "$or": [{ "blk.i": { "$gte": 670000 }}, { "blk": null}]
          }
        },
        {
          "$sort": {
            "_id": -1
          }
        },
        {
          "$skip": skip
        },
        {
          "$limit": limit
        }
      ],
      "limit": limit
    },
    "r": {
      "f": "[ .[] | { name: .slp.detail.name, date: .blk.t, tokenId: .slp.detail.tokenIdHex, owner: .slp.detail.outputs[0].address } ]"
    }
  };

  if (address) {
    if (address.indexOf("simpleledger:") === -1) {
      address = `simpleledger:${address}`;
    }

    (query["q"]["aggregate"] as any[])[0]["$match"]["slp.detail.outputs.address"] = address;
  }

  // console.log(JSON.stringify(query, null, 2));

  return query;
}

export function transactionHistory(tokenId: string) {
  let query = {
    "v": 3,
    "q": {
      "db": [
        "c", "u"
      ],
      "aggregate": [
        {
          "$match": {
            "slp.detail.tokenIdHex": tokenId
          }
        },
        {
          "$limit": 1000
        },
        {
          "$lookup": {
            "from": "graphs",
            "localField": "tx.h",
            "foreignField": "graphTxn.txid",
            "as": "graph"
          }
        }
      ],
      "limit": 1000
    },
      "r": {
        "f": "[ .[] | { txType: .graph[0].graphTxn.details.transactionType, previousOwner: .graph[0].graphTxn.inputs[0].address, owner: .graph[0].graphTxn.outputs[0].address, date: .blk.t, tokenId: .slp.detail.tokenIdHex } ]"
      }
  }

  return query;
}

export function singleWaifu(tokenId: string) {
  let query = {
    "v": 3,
    "q": {
      "db": ["t"],
      "aggregate": [
        {
          "$match": {
            "tokenDetails.tokenIdHex": tokenId
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
      ]
    },
    "r": {
      "f": "[ .[] | { name: .tokenDetails.name, date: .tokenDetails.timestamp_unix, tokenId: .tokenDetails.tokenIdHex, owner: .graph[0].graphTxn.outputs[0].address } ]"
    }
  }

  return query;
}

export function randomWaifus(limit: number = 10) {
  return {
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
        },
        { "$sample": { "size": limit } }
      ],
      'sort': {
        'tokenDetails.timestamp_unix': -1,
      },
    },
    "r": {
      "f": "[ .[] | { name: .tokenDetails.name, date: .tokenDetails.timestamp_unix, tokenId: .tokenDetails.tokenIdHex, owner: .graph[0].graphTxn.outputs[0].address } ]"
    }
  };
}
