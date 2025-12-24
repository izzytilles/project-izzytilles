/**********************************************************************
 * NAME: Izzy Tilles
 * CLASS: CPSC 321
 * DATE: 12/9/2023
 * HOMEWORK: Final Project
 * DESCRIPTION: Website for navigating a database of the members of the San Francisco Giants and their accomplishments
 **********************************************************************/
const { Pool } = require('pg');
const express = require('express');
const path = require('path');

// the credential info
// Use environment variables in production, config.json in development
let pool;
if (process.env.DATABASE_URL) {
    // Render provides DATABASE_URL
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    // Local development with config.json
    const config = require('./config.json');
    pool = new Pool({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port || 5432
    });
}

// queries defined in other file 
const lib = require('./lib');

// create and config the express application
const PORT = process.env.PORT || 3000;
var app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// define menu items
const menuItems = [
    { id: 1, name: 'Players' },
    { id: 2, name: 'Awards' },
    { id: 3, name: 'Edit Database' },
];

// redirect root to home page
app.get('/', function (request, response) {
    response.redirect('/home');
});

// serve the form -- access at http://localhost:3000/
app.get('/home', function (request, response) {
    const homeMenu = menuItems.map(item => `<li><a href="/search/${item.id}">${item.name}</a></li>`).join('');
    var homePage = '<html>\n<head>\n';
    homePage += '<title>San Francisco Giants Database</title>\n';
    homePage += '<style>';
    homePage += 'body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }';
    homePage += 'ul { list-style-type: none; margin: 0; padding: 0; position: absolute; top: 10px; left: 10px; }';
    homePage += 'ul li { display: inline; margin-right: 10px; }';
    homePage += '</style>\n</head>';

    homePage += '<body>\n<img src="/sfgiantslogo2.png" alt ="SF Giants logo" style="width: 600px; height: 325px;">';
    homePage += '<h1>Welcome to the \n San Francisco Giants \n Database</h1>';
    homePage += '<ul>' + homeMenu + '</ul>';
    homePage += '</body>\n</html>';

    response.send(homePage);
    //result is 1/2/3 --> what page they want to navigate to 

});

// generate player page so users can narrow query - pitchers or hitters
app.get('/search/1', function(request, response) {

        var playerPage = '<html>\n<head>\n';
        playerPage += '<body> <h1>San Francisco Giants Database: Players<h1>\n<style>';
        playerPage += 'body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }';
        playerPage += 'ul { list-style-type: none; margin: 0; padding: 0; position: absolute; top: 10px; left: 10px; }';
        playerPage += 'ul li { display: inline; margin-right: 10px; }';
        playerPage += '</style>\n</head>\n';
        playerPage += '<form method="get" action="/search/player">';
        playerPage += ' <label for="pitchers">Pitchers:</label>';
        playerPage += '<input type="radio" id="pitchers" name="criteria" value="pitchers">';
        playerPage += '<label for="hitters">Hitters:</label>';
        playerPage += '<input type="radio" id="hitters" name="criteria" value="hitters">';
        playerPage += '<button type="submit">Search</button>';
        playerPage += '</form>';
        playerPage += '</body>\n</html>';

        response.send(playerPage);
    
});

// makes page that allows you to show all player all-time Giants stats, search players indiv, and stats leaders
app.get(('/search/player'), function(request, response) {
    const playerType = request.query.criteria;

        if (playerType == "pitchers") {
            var pitcherPage = '<html>\n<head>\n<style>';
            pitcherPage += 'body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }';
            pitcherPage += 'ul { list-style-type: none; margin: 0; padding: 0; position: absolute; top: 10px; left: 10px; }';
            pitcherPage += 'ul li { display: inline; margin-right: 10px; }';
            pitcherPage += '</style>\n</head>\n'; 
            pitcherPage += '<body>\n'; 
            pitcherPage += '<h1>San Francisco Giants Database: Pitchers</h1>';

            // search bar for individual player stats by season
            pitcherPage += '<form method="get" action="/search/pitcher">';
            pitcherPage += '    <label for="search">Search by individual player:</label>';
            pitcherPage += '    <input type="text" id="search" name="search">';
            pitcherPage += '    <button type="submit">Submit</button>';
            pitcherPage += '</form>';
            // dropdown menu for sorting all-time stats
            pitcherPage += '<form method="get" action="/search/pitcher">';
            pitcherPage += '    <label for="sort">All-time stats -   Sort by:</label>';
            pitcherPage += '    <select id="sort" name="sort">';
            pitcherPage += '        <option value="games_played">Games Played</option>';
            pitcherPage += '        <option value="salary">Salary</option>';
            pitcherPage += '        <option value="war">WAR</option>';
            pitcherPage += '        <option value="wins">Wins</option>';
            pitcherPage += '        <option value="losses">Losses</option>';
            pitcherPage += '        <option value="saves">Saves</option>';
            pitcherPage += '        <option value="strikeouts">Strikeouts</option>';
            pitcherPage += '        <option value="innings">Innings</option>';
            pitcherPage += '        <option value="era">ERA</option>';
            pitcherPage += '        <option value="whip">WHIP</option>';
            pitcherPage += '    </select>';
            pitcherPage += '    <button type="submit">Submit</button>';
            pitcherPage += '</form>';
    
            response.send(pitcherPage);
        };
        
        if (playerType == "hitters") {
            var hitterPage = '<html>\n<head>\n<style>';
            hitterPage += 'body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }';
            hitterPage += 'ul { list-style-type: none; margin: 0; padding: 0; position: absolute; top: 10px; left: 10px; }';
            hitterPage += 'ul li { display: inline; margin-right: 10px; }';
            hitterPage += '</style>\n</head>\n';
            hitterPage += '<body>\n';
            hitterPage += '<h1>San Francisco Giants Database: Hitters</h1>';

            // search bar for individual player stats by season
            hitterPage += '<form method="get" action="/search/hitter">';
            hitterPage += '    <label for="search">Search by individual player:</label>';
            hitterPage += '    <input type="text" id="search" name="search">';
            hitterPage += '    <button type="submit">Submit</button>';
            hitterPage += '</form>';
            // dropdown menu for sorting all-time stats
            hitterPage += '<form method="get" action="/search/hitter">';
            hitterPage += '    <label for="sort">All-time stats -   Sort by:</label>';
            hitterPage += '    <select id="sort" name="sort">';
            hitterPage += '        <option value="games_played">Games Played</option>';
            hitterPage += '        <option value="salary">Salary</option>';
            hitterPage += '        <option value="war">WAR</option>';
            hitterPage += '        <option value="hits">Hits</option>';
            hitterPage += '        <option value="singles">Singles</option>';
            hitterPage += '        <option value="doubles">Doubles</option>';
            hitterPage += '        <option value="triples">Triples</option>';
            hitterPage += '        <option value="home_runs">Home Runs</option>';
            hitterPage += '        <option value="stolen_bases">Stolen Bases</option>';
            hitterPage += '        <option value="batting_avg">Batting Avg</option>';
            hitterPage += '        <option value="ops">OPS</option>';
            hitterPage += '        <option value="slg">SLG</option>';
            hitterPage += '    </select>';
            // dropdown menu for sorting all-time stats by position
            hitterPage += '    <label for="position">Position:</label>';
            hitterPage += '    <select id="position" name="position">';
            hitterPage += '        <option value="">All Positions</option>';
            hitterPage += '        <option value="C">Catcher</option>';
            hitterPage += '        <option value="1B">First Base</option>';
            hitterPage += '        <option value="2B">Second Base</option>';
            hitterPage += '        <option value="SS">Short Stop</option>';
            hitterPage += '        <option value="3B">Third Base</option>';
            hitterPage += '        <option value="LF">Left Field</option>';
            hitterPage += '        <option value="RF">Right Field</option>';
            hitterPage += '        <option value="CF">Center Field</option>';
            hitterPage += '    </select>';
            hitterPage += '    <button type="submit">Submit</button>';
            hitterPage += '</form>';
            hitterPage += '</body>\n</html>';
    
            response.send(hitterPage);
        };
        
});

// searching pitchers! either by search bar or all-time sorted by selected stats
app.get(('/search/pitcher'), function(request, response) {
    var pitcher = request.query.search;
    var sortStats = request.query.sort;

    if (pitcher) {
        pool.query(lib.choose_pitcher, [pitcher], function(err, result) {
            if (err) {
                console.log('Error:', err);
                return response.status(500).send('Database error');
            }

            var rows = result.rows;
            var str = '<html>\n<body>\n';
            str += '<p>Pitcher stats: ' + pitcher + '</p>\n';
            str += '<table border="1">\n';
            str += '<tr><th>Season</th><th>Team</th><th>Games Pitched</th><th>Salary</th>';
            str += '<th>WAR</th><th>Wins</th><th>Losses</th><th>Saves</th>';
            str += '<th>Strikeouts</th><th>Innings</th><th>ERA</th>';
            str += '<th>WHIP</th></tr>\n';

            for (const r of rows) {
                str += '<tr>';
                str += '<td>' + r['season'] + '</td>';
                str += '<td>' + r['team_name'] + '</td>';
                str += '<td>' + r['games_played'] + '</td>';
                str += '<td>' + r['salary'] + '</td>';
                str += '<td>' + r['war'] + '</td>';
                str += '<td>' + r['wins'] + '</td>';
                str += '<td>' + r['losses'] + '</td>';
                str += '<td>' + r['saves'] + '</td>';
                str += '<td>' + r['strikeouts'] + '</td>';
                str += '<td>' + r['innings'] + '</td>';
                str += '<td>' + r['era'] + '</td>';
                str += '<td>' + r['whip'] + '</td>';
                str += '</tr>\n';
            };

            str += '</table>\n';
            str += '</body>\n</html>\n';
            response.send(str);
        });

    }
    else {
        var allTimeQuery = lib.all_time_pitcher;
        // NO SQL injection attacks!
        if (sortStats == 'games_played') {
            allTimeQuery += lib.all_time_games_pitched;
        }
        else if (sortStats == 'salary') {
            allTimeQuery += lib.all_time_salary_pitcher;
        }
        else if (sortStats == 'war') {
            allTimeQuery += lib.all_time_war_pitcher;
        }
        else if (sortStats == 'wins') {
            allTimeQuery += lib.all_time_wins;
        }
        else if (sortStats == 'losses') {
            allTimeQuery += lib.all_time_losses;
        }
        else if (sortStats == 'saves') {
            allTimeQuery += lib.all_time_saves;
        }
        else if (sortStats == 'strikeouts') {
            allTimeQuery += lib.all_time_strikeouts;
        }
        else if (sortStats == 'innings') {
            allTimeQuery += lib.all_time_innings;
        }
        else if (sortStats == 'era') {
            allTimeQuery += lib.all_time_era;
        }
        else if (sortStats == 'whip') {
            allTimeQuery += lib.all_time_whip;
        }
        // if no recognized sort_stat, returned table will sort by ERA automatically
        else {
            allTimeQuery += ' ORDER BY era';
        };

        pool.query(allTimeQuery, function(err, result) {
            if (err) {
                console.log('Error:', err);
                return response.status(500).send('Database error');
            }

            var rows = result.rows;
            var str = '<html>\n<body>\n';
            str += '<p>All-time leaders: </p>\n';
            str += '<table border="1">\n';
            str += '<tr><th>Player</th><th>Games Pitched</th><th>Salary</th>';
            str += '<th>WAR</th><th>Wins</th><th>Losses</th><th>Saves</th>';
            str += '<th>Strikeouts</th><th>Innings</th><th>ERA</th>';
            str += '<th>WHIP</th></tr>\n';

            //iterate thru result set
            for (const r of rows) {
                str += '<tr>';
                str += '<td>' + r['player_name'] + '</td>';
                str += '<td>' + r['games_played'] + '</td>';
                str += '<td>' + r['salary'] + '</td>';
                str += '<td>' + r['war'] + '</td>';
                str += '<td>' + r['wins'] + '</td>';
                str += '<td>' + r['losses'] + '</td>';
                str += '<td>' + r['saves'] + '</td>';
                str += '<td>' + r['strikeouts'] + '</td>';
                str += '<td>' + r['innings'] + '</td>';
                str += '<td>' + r['era'] + '</td>';
                str += '<td>' + r['whip'] + '</td>';
                str += '</tr>\n';
            }

            str += '</table>\n';

            response.send(str);
        });
    }

});

// if user selected to search an individual hitter, then player's stats are returned (by season)
// if user selected an all-time list, then that is returned... will be sorted by a position unless they chose 'all'
app.get(('/search/hitter'), function(request, response) {
    var hitter = request.query.search;
    var sortStats = request.query.sort;
    var position = request.query.position;

    if (hitter) {
        pool.query(lib.choose_hitter, [hitter], function(err, result) {
            if (err) {
                console.log('Error:', err);
                return response.status(500).send('Database error');
            }

            var rows = result.rows;
            var str = '<html>\n<body>\n';
            str += '<p>Hitter stats: ' + hitter + '</p>\n';
            str += '<table border="1">\n';
            str += '<tr><th>Season</th><th>Team</th><th>Games Played</th><th>Salary</th>';
            str += '<th>WAR</th><th>Hits</th><th>Singles</th><th>Doubles</th>';
            str += '<th>Triples</th><th>Home Runs</th><th>Stolen Bases</th>';
            str += '<th>Batting Avg</th><th>OPS</th><th>SLG</th></tr>\n';

            for (const r of rows) {
                str += '<tr>';
                str += '<td>' + r['season'] + '</td>';
                str += '<td>' + r['team_name'] + '</td>';
                str += '<td>' + r['games_played'] + '</td>';
                str += '<td>' + r['salary'] + '</td>';
                str += '<td>' + r['war'] + '</td>';
                str += '<td>' + r['hits'] + '</td>';
                str += '<td>' + r['singles'] + '</td>';
                str += '<td>' + r['doubles'] + '</td>';
                str += '<td>' + r['triples'] + '</td>';
                str += '<td>' + r['homeruns'] + '</td>';
                str += '<td>' + r['stolen_bases'] + '</td>';
                str += '<td>' + r['batting_avg'] + '</td>';
                str += '<td>' + r['ops'] + '</td>';
                str += '<td>' + r['slg'] + '</td>';
                str += '</tr>\n';
            };

            str += '</table>\n';
            str += '</body>\n</html>\n';
            response.send(str);
        });
    }
    else {
        var allTimeQuery = lib.all_time_hitter;
        // NO SQL injection attacks!
        if (sortStats == 'games_played') {
            allTimeQuery += lib.all_time_games_played;
        }
        else if (sortStats == 'salary') {
            allTimeQuery += lib.all_time_salary;
        }
        else if (sortStats == 'war') {
            allTimeQuery += lib.all_time_war;
        }
        else if (sortStats == 'hits') {
            allTimeQuery += lib.all_time_hits;
        }
        else if (sortStats == 'singles') {
            allTimeQuery += lib.all_time_hits;
        }
        else if (sortStats == 'doubles') {
            allTimeQuery += lib.all_time_doubles;
        }
        else if (sortStats == 'triples') {
            allTimeQuery += lib.all_time_triples;
        }
        else if (sortStats == 'home_runs') {
            allTimeQuery += lib.all_time_homeruns;
        }
        else if (sortStats == 'stolen_bases') {
            allTimeQuery += lib.all_time_sb;
        }
        else if (sortStats == 'batting_avg') {
            allTimeQuery += lib.all_time_batting_avg;
        }
        else if (sortStats == 'ops') {
            allTimeQuery += lib.all_time_ops;
        }
        else if (sortStats == 'slg') {
            allTimeQuery += lib.all_time_slg;
        }
        // if no recognized sort_stat, returned table will sort by batting avg automatically
        else {
            allTimeQuery += ' ORDER BY batting_avg';
        };

        // if no specific position is inputted, then include every position in results
        if (position == "") {
            allTimeQuery = allTimeQuery.replace("WHERE p.primary_position = ?", "WHERE 1=1");
        }
        pool.query(allTimeQuery, [position], function(err, result) {
            if (err) {
                console.log('Error:', err);
                return response.status(500).send('Database error');
            }

            var rows = result.rows;
            var str = '<html>\n<body>\n';
            str += '<p>All-time leaders: ' + position + '</p>\n';
            str += '<table border="1">\n';
            str += '<tr><th>Player</th><th>Games Played</th><th>Salary</th>';
            str += '<th>WAR</th><th>Hits</th><th>Singles</th><th>Doubles</th>';
            str += '<th>Triples</th><th>Home Runs</th><th>Stolen Bases</th>';
            str += '<th>Batting Avg</th><th>OPS</th><th>SLG</th></tr>\n';

            //iterate thru result set
            for (const r of rows) {
                str += '<tr>';
                str += '<td>' + r['player_name'] + '</td>';
                str += '<td>' + r['games_played'] + '</td>';
                str += '<td>' + r['salary'] + '</td>';
                str += '<td>' + r['war'] + '</td>';
                str += '<td>' + r['hits'] + '</td>';
                str += '<td>' + r['singles'] + '</td>';
                str += '<td>' + r['doubles'] + '</td>';
                str += '<td>' + r['triples'] + '</td>';
                str += '<td>' + r['home_runs'] + '</td>';
                str += '<td>' + r['stolen_bases'] + '</td>';
                str += '<td>' + r['batting_avg'] + '</td>';
                str += '<td>' + r['ops'] + '</td>';
                str += '<td>' + r['slg'] + '</td>';
                str += '</tr>\n';
            }

            str += '</table>\n';

            response.send(str);
        });
    }
});

// second option: choose to see awards and winners 
app.get('/search/2', function(request, response) {

    var awardPage = '<html>\n<head>\n';
    awardPage += '<body> <h1>San Francisco Giants Database: Awards<h1>\n<style>';
    awardPage += 'body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }';
    awardPage += 'ul { list-style-type: none; margin: 0; padding: 0; position: absolute; top: 10px; left: 10px; }';
    awardPage += 'ul li { display: inline; margin-right: 10px; }';
    awardPage += '</style>\n</head>\n';
    awardPage += '<form method="get" action="/search/award">';
    awardPage += ' <label for="player">Player:</label>';
    awardPage += '<input type="radio" id="player" name="criteria" value="player">';
    awardPage += '<label for="team">Team:</label>';
    awardPage += '<input type="radio" id="team" name="criteria" value="team">';
    awardPage += '<button type="submit">Search</button>';
    awardPage += '</form>';
    awardPage += '</body>\n</html>';

    response.send(awardPage);
});

//narrow down results - show either player accolades or team accolades
app.get('/search/award', function(request, response) {
    const winner = request.query.criteria;

    if (winner == 'player') {
        var playerPage = '<html>\n<head>\n<style>';
        playerPage += 'body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }';
        playerPage += 'ul { list-style-type: none; margin: 0; padding: 0; position: absolute; top: 10px; left: 10px; }';
        playerPage += 'ul li { display: inline; margin-right: 10px; }';
        playerPage += '</style>\n</head>\n'; 
        playerPage += '<body>\n'; 
        playerPage += '<h1>San Francisco Giants Database: Individual Awards</h1>';

        // search bar for individual player's award(s) by season'
        playerPage += '<form method="get" action="/search/playeraward">';
        playerPage += '    <label for="player">Search by individual player:</label>';
        playerPage += '    <input type="text" id="player" name="player">';
        playerPage += '    <button type="submit">Submit</button>';
        playerPage += '</form>';
        // dropdown menu for sorting by award
        playerPage += '<form method="get" action="/search/playeraward">';
        playerPage += '    <label for="sort">All winners -   Sort by:</label>';
        playerPage += '    <select id="sort" name="sort">';
        playerPage += '        <option value="MVP">MVP</option>';
        playerPage += '        <option value="Cy Young">Cy Young</option>';
        playerPage += '        <option value="Rookie of the Year">Rookie of the Year</option>';
        playerPage += '        <option value="NLCS MVP">NLCS MVP</option>';
        playerPage += '        <option value="Willie Mays World Series MVP">WS MVP</option>';
        playerPage += '        <option value="All-Star Game MVP">All-Star Game MVP</option>';
        playerPage += '        <option value="Comeback Player of the Year">Comeback Player of the Year</option>';
        playerPage += '        <option value="Batting Champion">Batting Champion</option>';
        playerPage += '        <option value="Pitching Champion">Pitching Champion</option>';
        playerPage += '        <option value="Triple Crown">Triple Crown</option>';
        playerPage += '        <option value="Gold Glove">Gold Glove</option>';
        playerPage += '        <option value="All-Star">All-Star</option>';
        playerPage += '        <option value="Silver Slugger">Silver Slugger</option>';
        playerPage += '        <option value="Roberto Clemente Award">Roberto Clemente Award</option>';
        playerPage += '        <option value="Hall of Fame">Hall of Fame</option>';
        playerPage += '    </select>';
        playerPage += '    <button type="submit">Submit</button>';
        playerPage += '</form>';

        response.send(playerPage); 
    }
    else if (winner == 'team') {
        var teamPage = '<html>\n<head>\n<style>';
        teamPage += 'body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }';
        teamPage += 'ul { list-style-type: none; margin: 0; padding: 0; position: absolute; top: 10px; left: 10px; }';
        teamPage += 'ul li { display: inline; margin-right: 10px; }';
        teamPage += '</style>\n</head>\n'; 
        teamPage += '<body>\n'; 
        teamPage += '<h1>San Francisco Giants Database: Team Awards</h1>';

        // dropdown menu for sorting by championship
        teamPage += '<form method="get" action="/search/teamaward">';
        teamPage += '    <label for="sort">All winners -   Sort by:</label>';
        teamPage += '    <select id="sort" name="sort">';
        teamPage += '        <option value="NL Pennant">NL Pennant</option>';
        teamPage += '        <option value="World Series Title">World Series Title</option>';
        teamPage += '        <option value="NLDS Title">NLDS Title</option>';
        teamPage += '        <option value="Wild Card">Wild Card</option>';
        teamPage += '    </select>';
        teamPage += '    <button type="submit">Submit</button>';
        teamPage += '</form>';

        response.send(teamPage); 

    }

});

// displays the player's accolades or the players who have won an accolade
app.get(('/search/playeraward'), function(request, response) {
    var player = request.query.player;
    var award = request.query.sort;

    var query = lib.choose_player_winner;
    if (player) {
        query += lib.choose_winner;
        pool.query(query, [player], function(err, result) {
            if (err) {
                console.log('Error:', err);
                return response.status(500).send('Database error');
            }

            var rows = result.rows;
            var str = '<html>\n<body>\n';
            str += '<p>Awards earned by ' + player + ':</p>\n';
            str += '<table border="1">\n';
            str += '<tr><th>Player</th><th>Award</th><th>Season</th></tr>\n';

            for (const r of rows) {
                str += '<tr>';
                str += '<td>' + r['player_name'] + '</td>';
                str += '<td>' + r['award_name'] + '</td>';
                str += '<td>' + r['season'] + '</td>';
                str += '</tr>\n';
            };

            str += '</table>\n';
            str += '</body>\n</html>\n';
            response.send(str);
        });

    }
    // if trying to sort for resuts by award
    else {
        query += lib.choose_award;
        pool.query(query, [award], function(err, result) {
            if (err) {
                console.log('Error:', err);
                return response.status(500).send('Database error');
            }

            var rows = result.rows;
            var str = '<html>\n<body>\n';
            str += '<p>Giants who have won the ' + award + ':</p>\n';
            str += '<table border="1">\n';
            str += '<tr><th>Player</th><th>Award</th><th>Season</th></tr>\n';

            for (const r of rows) {
                str += '<tr>';
                str += '<td>' + r['player_name'] + '</td>';
                str += '<td>' + r['award_name'] + '</td>';
                str += '<td>' + r['season'] + '</td>';
                str += '</tr>\n';
            };

            str += '</table>\n';
            str += '</body>\n</html>\n';
            response.send(str);
        });
    }

});

// displays the teams that have won a title
app.get(('/search/teamaward'), function(request, response) {
    var award = request.query.sort;

    var query = lib.choose_team_winner;
    pool.query(query, [award], function(err, result) {
        if (err) {
            console.log('Error:', err);
            return response.status(500).send('Database error');
        }

        var rows = result.rows;
        var str = '<html>\n<body>\n';
        str += '<p>' + award + ' earned by the Giants</p>\n';
        str += '<table border="1">\n';
        str += '<tr><th>Team</th><th>Award</th><th>Season</th><th>Series Wins</th><th>Series Losses</th></tr>\n';


        for (const r of rows) {
            //deal with NULL values - print as N/A
            var seriesWins;
            var seriesLosses;
            if (r['series_wins'] == null) {
                seriesWins = 'N/A';
            }
            else {
                seriesWins = r['series_wins'];
            }
            if (r['series_losses'] == null) {
                seriesLosses = 'N/A';
            }
            else {
                seriesLosses = r['series_losses'];
            }
            str += '<tr>';
            str += '<td>' + r['team_name'] + '</td>';
            str += '<td>' + r['award_name'] + '</td>';
            str += '<td>' + r['season'] + '</td>';
            str += '<td>' + seriesWins + '</td>';
            str += '<td>' + seriesLosses + '</td>';
            str += '</tr>\n';
        };

        str += '</table>\n';
        str += '</body>\n</html>\n';
        response.send(str);
    });

});

app.get('/search/3', function(request, response) {
    var editPage = '<html>\n<head>\n';
    editPage += '<body> <h1>San Francisco Giants Database: Editing<h1>\n<style>';
    editPage += 'body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }';
    editPage += 'ul { list-style-type: none; margin: 0; padding: 0; position: absolute; top: 10px; left: 10px; }';
    editPage += 'ul li { display: inline; margin-right: 10px; }';
    editPage += '</style>\n</head>\n';
    editPage += '<form method="get" action="/edit">';
    editPage += ' <label for="edit_stats">Edit Stats:</label>';
    editPage += '<input type="radio" id="edit" name="criteria" value="edit">';
    editPage += '<label for="delete_season">Delete player\'s season:</label>';
    editPage += '<input type="radio" id="delete_season" name="criteria" value="delete_season">';
    editPage += '<label for="add_season">Add player\'s season stats:</label>';
    editPage += '<input type="radio" id="add_season" name="criteria" value="add_season">';
    editPage += '<label for="add_player">Add player:</label>';
    editPage += '<input type="radio" id="add_player" name="criteria" value="add_player">';
    editPage += '<button type="submit">Search</button>';
    editPage += '</form>';
    editPage += '</body>\n</html>';

    response.send(editPage);

});

app.get('/edit', function(request, response){
    const action = request.query.criteria;

    if (action == 'edit') {
        const q = 'SELECT player_name, season FROM hitter ORDER BY season DESC';
        pool.query(q, function (err, result) {
            if (err) {
                console.log('Error:', err);
                return response.status(500).send('Database error');
            }
            //build up the html form
            var rows = result.rows;
            var str = '<html>\n<body>\n';
            str += '<b>Update season information: </b>\n<br/>';
            str += '<form action="/updated_player_info.html" method="POST">\n';
            str += '<table>\n<tr>\n<td>Player:</td><td>\n';
            str += '<select name="player_name">\n';
            for (const r of rows) { // button shows player and season, returns player-season
                str += '<option value="' + r['player_name'] + '-' + r['season'] + '">' + r['player_name'] + ' - ' + r['season'] + '</option>\n';
            }

            str += '</select>\n</td>\n</tr>\n';
            str += '<td>Games Played:</td>';
            str += '<td><input type ="text" name="games_played"></td>\n</tr>\n<tr>';
            str += '<td>Salary:</td>';
            str += '<td><input type ="text" name="salary"></td>\n</tr>';
            str += '<td>WAR:</td>';
            str += '<td><input type ="text" name="war"></td>\n</tr>';
            str += '<td>Batting Average:</td>';
            str += '<td><input type ="text" name="batting_avg"></td>\n</tr>';
            str += '<td>On Base Plus Slugging:</td>';
            str += '<td><input type ="text" name="ops"></td>\n</tr>';
            str += '<td>Slugging:</td>';
            str += '<td><input type ="text" name="slg"></td>\n</tr>';
            str += '<tr><td><input type="submit" value="Update"/></td></tr>';
            str += '</table>\n</form>\n</body>\n</html>';

            response.send(str);
        });
    }
    else if (action == 'delete_season') {
        const q = 'SELECT player_name, season FROM hitter ORDER BY season DESC';
        pool.query(q, function (err, result) {
            if (err) {
                console.log('Error:', err);
                return response.status(500).send('Database error');
            }
            //build up the html form
            var rows = result.rows;
            var str = '<html>\n<body>\n';
            str += '<b>Delete a player\'s season information: </b>\n<br/>';
            str += '<form action="/delete_player_info.html" method="POST">\n';
            str += '<table>\n<tr>\n<td>Player:</td><td>\n';
            str += '<select name="player_name">\n';
            for (const r of rows) {
                str += '<option value="' + r['player_name'] + '-' + r['season'] + '">' + r['player_name'] + ' - ' + r['season'] + '</option>\n';
            }
            str += '</select>\n</td>\n</tr>\n<tr>';

            str += '</select>\n</td>\n</tr>\n<tr>';
            str += '<tr><td><input type="submit" value="Update"/></td></tr>';
            str += '</table>\n</form>\n</body>\n</html>';

            response.send(str);
        });

    }
    else if (action == 'add_season') {

        //build up the html form
            var str = '<html>\n<body>\n';
            str += '<b>Add a hitter\'s stats for a season: </b>\n<br/>';
            str += '<form action="/add_player_season.html" method="POST">\n';
            str += '</select>\n</td>\n</tr>\n';
            str += '<td>Player Name:</td>';
            str += '<td><input type ="text" name="player_name"></td>\n</tr>\n<tr>';
            str += '<td>Season:</td>';
            str += '<td><input type ="text" name="season"></td>\n</tr>\n<tr>';
            str += '<td>Team name:</td>';
            str += '<td><input type ="text" name="team_name"></td>\n</tr>\n<tr>';
            str += '<td>Games Played:</td>';
            str += '<td><input type ="text" name="games_played"></td>\n</tr>\n<tr>';
            str += '<td>Salary:</td>';
            str += '<td><input type ="text" name="salary"></td>\n</tr>';
            str += '<td>WAR:</td>';
            str += '<td><input type ="text" name="war"></td>\n</tr>';
            str += '<td>Hits:</td>';
            str += '<td><input type ="text" name="hits"></td>\n</tr>\n<tr>';
            str += '<td>Singles:</td>';
            str += '<td><input type ="text" name="singles"></td>\n</tr>\n<tr>';
            str += '<td>Doubles:</td>';
            str += '<td><input type ="text" name="doubles"></td>\n</tr>\n<tr>';
            str += '<td>Triples:</td>';
            str += '<td><input type ="text" name="triples"></td>\n</tr>\n<tr>';
            str += '<td>Homeruns:</td>';
            str += '<td><input type ="text" name="home_runs"></td>\n</tr>\n<tr>';
            str += '<td>Stolen Bases:</td>';
            str += '<td><input type ="text" name="stolen_bases"></td>\n</tr>\n<tr>';
            str += '<td>Batting Average:</td>';
            str += '<td><input type ="text" name="batting_avg"></td>\n</tr>';
            str += '<td>On Base Plus Slugging:</td>';
            str += '<td><input type ="text" name="ops"></td>\n</tr>';
            str += '<td>Slugging:</td>';
            str += '<td><input type ="text" name="slg"></td>\n</tr>';
            str += '<tr><td><input type="submit" value="Update"/></td></tr>';
            str += '</table>\n</form>\n</body>\n</html>';

            response.send(str);
        }

});

app.post('/updated_player_info.html', function(request, response) {
    var games = request.body.games_played;
    var salary = request.body.salary;
    var war = request.body.war;
    var batting_avg = request.body.batting_avg;
    var ops = request.body.ops;
    var slg = request.body.slg;
    var selectedValue = request.body.player_name; // 'player_name' contains player name and season
    var values = selectedValue.split('-');
    var player = values[0]; // player name
    var season = values[1]; // season

    var updateList = [games, salary, war, batting_avg, ops, slg, player, season];

    //update - with select stats
    const q1 = 'UPDATE hitter SET games_played = $1, salary = $2, war = $3, batting_avg = $4, ops = $5, slg = $6 WHERE player_name = $7 AND season = $8';


    //update the list
    pool.query(q1, updateList, function(err, result) {
        if (err) {
            console.log('Error: ', err);
            return response.status(500).send('Database error');
        } else {
            response.send('Player information updated successfully.');
        }
    });
});

app.post('/delete_player_info.html', function(request, response) {
    var selectedValue = request.body.player_name; // same as above function
    var values = selectedValue.split('-');
    var player = values[0];
    var season = values[1];

    console.log('Player:', player);
    console.log('Season:', season);

    var deleteList = [player, season];

    const q1 = 'DELETE FROM hitter WHERE player_name = $1 AND season = $2';

    //delete the record
    pool.query(q1, deleteList, function(err, result) {
        if (err) {
            console.log('Error: ', err);
            return response.status(500).send('Database error');
        }
        response.redirect('/home');
    });
});

// add the existing player's season stats
app.post('/add_player_season.html', function(request, response) {
    var player = request.body.player_name;
    var season = request.body.season;
    var team = request.body.team_name;
    var games = request.body.games_played;
    var salary = request.body.salary;
    var war = request.body.war;
    var hits = request.body.hits;
    var singles = request.body.singles;
    var doubles = request.body.doubles;
    var triples = request.body.triples;
    var homeruns = request.body.home_runs;
    var stolenBases = request.body.stolen_bases;
    var battingAvg = request.body.batting_avg;
    var ops = request.body.ops;
    var slg = request.body.slg;

    var seasonList = [player, season, team, games, salary, war, hits, singles, doubles, triples, homeruns, stolenBases, battingAvg, ops, slg ];

    // make sure player already exists - because foreign key constraints
    const playerCheckQuery = 'SELECT COUNT(*) as player_count FROM player WHERE player_name = $1';
    pool.query(playerCheckQuery, [player], function (err, playerResult) {
        if (err) {
            console.log('Error:', err);
            return response.redirect('/search/3');
        }

        const playerCount = playerResult.rows[0].player_count;

        // if player doesn't exist, warn user and exit back to edit page
        if (playerCount == 0) {
            return response.redirect('/search/3');
        }

        // if player exists, add them
        const q = lib.insert_season_hitter;
        pool.query(q, seasonList, function (err, result) {
            if (err) {
                console.log('Error:', err);
                return response.status(500).send('Database error');
            }
            response.redirect('/home');
        });
    });

});


