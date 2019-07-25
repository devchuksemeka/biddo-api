'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')



const track_request = `track-request`
const track_cycle = `track-cycle`
const trip_request = `trip-request`


// add a api prefix
Route.group(() => {
    Route.post('/signup', 'UserController.register').validator('CreateUser')
    Route.post('/login', 'UserController.login').validator('LoginUser')
    Route.get('/verify/:token', 'UserVerificationController.verifyAccountEmail').validator('VerifyEmail')
}).prefix('api/v1/auth')

Route.group(() => {
    // Route.get('user', 'UserController.getUser')

    // track request
    Route.post(`${track_request}/create`, 'TrackRequestController.create').validator('CreateTrackRequest')
    Route.post(`${track_request}/accept`, 'TrackRequestController.accept').validator("TrackerAcceptTrackRequest")
    Route.post(`${track_request}/accept-track-consent`, 'TrackRequestController.acceptTrackConsent').validator("AcceptTrackConsent")

    // track cycle
    Route.post(`${track_cycle}/create`, 'TrackCycleController.create').validator('CreateTrackCycle')
    Route.post(`${track_cycle}/join`, 'TrackCycleController.join').validator('JoinTrackCycle')
    Route.post(`${track_cycle}/add-member`, 'TrackCycleController.addMember').validator('AddMemberToTrackCycle')

    // track cycle
    Route.post(`${trip_request}/create`, 'TripRequestController.create').validator('CreateTripRequest')
    // Route.post(`${track_cycle}/join`, 'TrackCycleController.join').validator('JoinTrackCycle')
    // Route.post(`${track_cycle}/add-member`, 'TrackCycleController.addMember').validator('AddMemberToTrackCycle')

    // Route.post(`${track_request}/update-coordinate`, 'TrackRequestController.updateTrackRequestCordinate').validator("UpdateTrackRequestCoordinate")
  
}).prefix('api/v1').middleware('auth')

// Route.get('/', ({request,response}) => {
//   return response.json({ 
//     greeting : request.all()
//   })
// })

// Route.get('welcome', ({view}) =>{
//   return view.render('welcome')
// })
