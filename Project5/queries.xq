declare variable  $doc := doc("auction.xml");
<Q1-results>
    {
    let $r := $doc/site/regions
    return <total-count>{count($r//item)}</total-count>
}
</Q1-results>,
<Q2-results>
{
    for $e in $doc/site/regions/europe/item
        return{
        $e/name,
    <description>{$e/description/text/string()}</description>}
}
</Q2-results>,
<Q3-results>
{
    for $p in $doc/site/people/person
    let $ni := $doc/site/closed_auctions//buyer[@person=$p/@id]
        return {
        $p/name,
       <items-bought>{ count($ni) }</items-bought>
        }
}
</Q3-results>,
<Q4-results>
{
    for $ic in distinct-values($doc/site/people//interest/@category)
    return {
        <category>{
            $ic }
        </category>,
        <persons>{
            for $p in $doc/site/people/person
            where $p//interest/@category = $ic
                return{
                    $p/name
                }
        }</persons>
    }
}
</Q4-results>,
<Q5-results>
{
    for $ic in distinct-values($doc/site/people//interest/@category)
    return {
    <category>{
        $ic }
    </category>,
    <persons>{
        for $p in $doc/site/people/person
        where $p//interest/@category = $ic
        return{
        $p/name
        }
        }</persons>,
        <count>{
            let $p := $doc//people/person
            return{
                count($p[profile/interest[@category = $ic]])
            }
        }</count>
    }
}
</Q5-results>,
<Q6-results>
{
    for $ca in $doc//closed_auction
    for $ap in $doc/site/people/person
    for $ie in $doc/site/regions/europe/item
    where $ca/itemref[@item = $ie/@id]
    where $ca/buyer[@person = $ap/@id]
    return{
            <person>{$ap/name}</person>,
            <item>{$ie/name}</item>
    }
}
</Q6-results>,
<Q7-results>
{
    for $i in $doc/site/regions//item
    order by $i/name
    return{
        $i/name,
        $i/location
    }
}
</Q7-results>,
<Q8-results>
{
    for $fb in $doc//open_auction
    where $fb/bidder[personref/@person='person3']/following-sibling::bidder/personref[@person='person6']
    return{
        <reserve-price>{$fb/reserve/string()}</reserve-price>
    }
}
</Q8-results>