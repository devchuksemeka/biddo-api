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
// add a api prefix
Route.group(() => {
    Route.post('/signup', 'UserController.register').validator('CreateUser')
    Route.post('/login', 'UserController.login').validator('LoginUser')
    Route.get('/verify/:token', 'UserVerificationController.verifyAccountEmail').validator('VerifyEmail')
}).prefix('api/v1/auth')

Route.group(() => {
    Route.post('user', 'UserController.getUser')

    // track request

    Route.post(`${track_request}/create`, 'TrackRequestController.create').validator('CreateTrackRequest')
    Route.post(`${track_request}/accept`, 'TrackRequestController.accept').validator("TrackerAcceptTrackRequest")
    Route.post(`${track_request}/accept-track-consent`, 'TrackRequestController.acceptTrackConsent').validator("AcceptTrackConsent")
  
}).prefix('api/v1').middleware('auth')

Route.get('/', ({request,response}) => {
  return response.json({ 
    greeting : request.all()
  })
})

Route.get('test_enum', 'TestController.testEnum')
