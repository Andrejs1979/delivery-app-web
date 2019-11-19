const typeDefs = `
  scalar Date

  enum PostStatus {
    approved
    pending
    declined
}

type Account {
    id: ID!
    name: String
    type: String
    category: String
    apiKey: String
    status: String
    isLive: Boolean
    balance: String,
    postCount: Int,
    consumerCount: Int,
    locationCount: Int,
    campaigns: [Campaign],
    consumers: [Consumer],
    posts: [Post]
    locations: [Location]
  }

type Ad {
    id: ID!
    size: [ Int ]
		aspectRatio: Float
		position: String
		background: Boolean
    message: String
    rate: String,
    currency: String,
    creativeURI: String,
    radius: Int,
    status: String
    secureURL: String
  }

  type Assets {
     id: ID
     logoURI: String
     defaultPictureURI: String
   }

   type Campaign {
    id: ID!
    name: String
    hashtag: String
    cooldown: Int
    logoURI: String
    ads: [Ad]
    status: String
    isLive: Boolean
    category: String
    limit: Int
    channels: [String]
    plan: String
    address: String
    email: String
    phone: String
    consumers: [Consumer]
    posts: [Post]
    locations: [Location]
    transactions: [Transaction]
    postCount: Int
    consumerCount: Int
  }

  type Consumer {
    id: ID!
    provider: String
    providerUID: String
    status: String
    email: String
    displayName: String
    firstName: String
    lastName: String
    avatar: String
    phone: String
    address: String
    country: String
    balance: String
    posts: [Post]
    campaigns: [Campaign]
    locations: [Location]
    transactions: [Transaction]
    postCount: Int
    approvedCount: Int
  }

   type Geo {
     id: ID
     type: String
     coordinates: [Float]
   }
  
  type Post {
    id: ID!
    date: Date
    uri: String
    rate: String
    currency: String
    status(filter: PostStatus): PostStatus
    statusText: String
    campaign: Campaign
    ad: Ad
    location: Location
    consumer: Consumer
    sharedOn: [String]
  }

  type Location {
    id: ID
    name: String
    campaigns: [Campaign]
    category: String
    address: String
    city: String
    state: String
    zip: String
    country: String
    distance: Float
    geometry: Geo
    assets: Assets
    active: Boolean
    verified: Boolean
    posts: [Post]
  }

  type Transaction {
    id: ID!
    type: String
    date: Date
    campaign: Campaign
    consumer: Consumer
    amount: String
    currency: String
    status: String
  }

  type User {
    id: ID!
    uid: String
    email: String
    firstName: String
    lastName: String,
    avatar: String
  }

  type Query {
    locationsByGeo(searchAreaProps: SearchAreaProps!, radius: Float!): [Location]
    currentLocation(locationGeoProps: LocationGeoProps!, radius: Float!): [Location]
    consumer(id: ID!): Consumer

    consumers(campaignID: ID): [Consumer]

    posts(limit: Int, status: PostStatus):[Post]
    post(id: ID!): Post
    
    locations(campaignID: ID, status: String): [Location]
    location(id: ID!): Location
    
    transactions: [Transaction]
    transaction(id: ID!): Transaction
    
    account: Account
    accounts(email: String): [Account]
    
    campaigns: [Campaign]
    campaign(id: ID!): Campaign
    
    ads(campaignID: ID): [Ad]
    ad(id: ID!): Ad

  }

  input AccountProps {
    id: ID
    name: String
    status: String
    isLive: Boolean
    type: String
    category: String
  }

  input AdProps {
    id: ID
    creativeURI: String
    size: Float
		position: String
		background: Boolean
    message: String
    rate: String
    currency: String
    radius: Int
    status: String
    secureURL: String
  }

  input CardProps {
    id: ID
 		provider: String
    providerID: String
    token: String
		providerName: String
		billingAddress: String
		billingCity: String
		billingState: String
		billingZip: String
		billingCountry: String
		brand: String
		last4: String
		expMM: Int
		expYYYY: Int
		type: String
		method: String
		country: String
  }

  input CampaignProps {
    id: ID
    name: String
    hashtag: String
    status: String
    isLive: Boolean
    type: String
    category: String
    limit: Int
  }

  input LocationProps {
    id: ID
    name: String
    category: String
    fullAddress: String
    address: String
    city: String
    state: String
    zip: String
    country: String
    geometry: LocationGeoProps
    verified: Boolean
    active: Boolean
    status: String
    source: String
    sourceID: String
  }

  input SearchAreaProps {
    type: String
    coordinates: [Float]
  }

  input LocationGeoProps {
    type: String
    coordinates: [Float]
  }

  input ConsumerProps {
    id: ID
    providerUID: String
    provider: String
    firebaseUID: String
    displayName: String
    email: String
    firstName: String
    lastName: String
    avatar: String
    phone: String
    address: String
    campaign: ID
  }

  input PostProps {
    id: ID,
    location: ID,
    campaign: ID,
    ad: ID,
    rate: String,
    currency: String,
    consumer: ID,
    uri: String
  }

  input UserProps {
    id: ID,
    uid: String,
    email: String,
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String
  }

  input SearchProps {
    propName: String,
    propValue: String
  }

  type Mutation {
    onboardAccount(accountProps: AccountProps): Account
    updateUser(userProps: UserProps): User

    createCard(cardProps: CardProps): Account
    updateCard(cardProps: CardProps): Account
    removeCard(cardProps: CardProps): Account

    authUser(consumerProps: ConsumerProps): Consumer
    createPost(postProps: PostProps): Post
    createConsumer(consumerProps: ConsumerProps): Consumer
    updateConsumer(consumerProps: ConsumerProps): Consumer
    
    createCampaign(campaignProps: CampaignProps, populateLocations: Boolean): Campaign
    activateCampaign(campaignProps: CampaignProps): Campaign
    updateCampaign(campaignProps: CampaignProps): Campaign

    createAd(adProps: AdProps, campaignID: ID!): Ad

    createLocations(locations: [LocationProps], campaignID: ID): [Location]
    activateLocation(locationProps: LocationProps): Location
    updateLocation(locationProps: LocationProps): Location
  
    approvePost(postID: ID!): Post
    declinePost(postID: ID!, statusText: String!): Post
  
  }
`;

module.exports = typeDefs;
