module.exports = {

    /* team queries */
    choose_team : 'SELECT * FROM team_year_info WHERE team_name = $1',
    wins_and_losses : 'AND wins >= $1 AND losses >= $2',
    budget : 'AND budget >= $1 AND budget <= $2',



    /* hitter queries */

    choose_hitter : 'SELECT * FROM hitter WHERE player_name = $1',

    all_time_hitter : `SELECT p.player_name, SUM(h.games_played) as games_played, SUM(h.salary) as salary, SUM(h.war) as war, SUM(h.hits) as hits, SUM(h.singles) as singles, SUM(h.doubles) as doubles,
                        SUM(h.triples) as triples, SUM(h.homeruns) as home_runs, SUM(h.stolen_bases) as stolen_bases, ROUND(AVG(h.batting_avg)::numeric, 3) as batting_avg, ROUND(AVG(h.ops)::numeric, 3) as ops, ROUND(AVG(h.slg)::numeric, 3) as slg
                    FROM hitter h JOIN player p USING (player_name)
                    WHERE p.primary_position = $1
                    GROUP BY p.player_name`,
    all_time_homeruns : ' ORDER BY home_runs DESC',
    all_time_games_played : ' ORDER BY games_played DESC',
    all_time_salary : ' ORDER BY salary DESC',
    all_time_hits : ' ORDER BY hits DESC',
    all_time_war : ' ORDER BY war DESC',
    all_time_singles : ' ORDER BY singles DESC',
    all_time_doubles : ' ORDER BY doubles DESC',
    all_time_triples : ' ORDER BY triples DESC',
    all_time_doubles : ' ORDER BY doubles DESC',
    all_time_batting_avg : ' ORDER BY batting_avg DESC',
    all_time_sb : ' ORDER BY stolen_bases DESC',
    all_time_ops : ' ORDER BY ops DESC',
    all_time_slg : ' ORDER BY slg DESC',


    /* pitcher queries */

    choose_pitcher : 'SELECT * FROM pitcher WHERE player_name = $1',

    all_time_pitcher : `SELECT p.player_name, SUM(pr.games_played) as games_played, SUM(pr.salary) as salary, SUM(pr.war) as war, SUM(pr.wins) as wins, SUM(pr.losses) as losses,
                            SUM(pr.saves) as saves, SUM(pr.strikeouts) as strikeouts, SUM(pr.innings) as innings, ROUND(AVG(pr.era)::numeric, 2) as era, ROUND(AVG(pr.whip)::numeric, 3) as whip
                    FROM pitcher pr JOIN player p USING (player_name)
                    GROUP BY p.player_name`,
    all_time_games_pitched: ' ORDER BY games_played DESC',
    all_time_salary_pitcher: ' ORDER BY salary DESC',
    all_time_war_pitcher: ' ORDER BY war DESC',
    all_time_wins: ' ORDER BY wins DESC',
    all_time_losses: ' ORDER BY losses ASC',
    all_time_saves: ' ORDER BY saves DESC',
    all_time_strikeouts: ' ORDER BY strikeouts DESC',
    all_time_innings: ' ORDER BY innings DESC',
    all_time_era: ' ORDER BY era ASC', 
    all_time_whip: ' ORDER BY whip ASC',

    /* award queries */
    choose_player_winner : 'SELECT * FROM player_winner ',

    choose_winner : ' WHERE player_name = $1 ORDER BY season',
    choose_award : ' WHERE award_name = $1 ORDER BY season',
    choose_year : ' WHERE pw.season = $1',

    choose_team_winner : 'SELECT * FROM team_winner WHERE award_name = $1',

    winning_roster : `SELECT pw.player_name AS player, pw.award_name AS award
                    FROM hitter h JOIN team_winner tw ON h.season = tw.season
                    LEFT OUTER JOIN player_winner pw ON h.player_name = pw.player_name AND h.season = pw.season
                    WHERE tw.award_name = $1 AND tw.season = $2`,

    /* editing queries */
    insert_player : 'INSERT INTO player VALUES ($1, $2, $3, $4, $5, $6)',
    insert_season_hitter : 'INSERT INTO hitter VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
    insert_season_pitcher : 'INSERT INTO pitcher VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)'

};